#!/usr/bin/env python

from argparse import ArgumentParser
from csv import DictReader
from glob import glob
import json
import os
import random
import string

"""
Maps a preformatted CSV-file into an API-supported JSON-file after globbing existing images in a source folder.

The source CSV-file must contain the following keys:
 - path (string) -- will also be used for filtering missing image files
 - alt (string)
 - aperture (float)
 - camera (string)
 - date (string) -- date in ISO string
 - focal_length (int)
 - shutter (float)

Optional fields are the following:
 - color (string) -- mean color of the image in HEX-format, e.g. #ff0000
 - description (string)
 - developer.name (string)
 - developer.duration (float)
 - film (string)
 - geo.latitude (float)
 - geo.longitude (float)
 - geo.place (string)
 - hash (string) -- blurhash
 - lens (string)
 - title (string)
"""

ID_LEN = 12


def create_argument_parser():
    parser = ArgumentParser(
        description="Maps a CSV- into a JSON-file based on existing source images.\nIf no images are found, the CSV file will be considered as single source of truth.")

    parser.add_argument('file', metavar="CSV", nargs=1,
                        help="the CSV file to map into JSON")
    parser.add_argument('-i', '--images', metavar="DIR",
                        nargs=1, help="path pointing to the source images")
    parser.add_argument('-o', '--output', metavar="JSON", default="out.json", nargs=1,
                        help="path pointing to the output location of the generated JSON-file")

    return parser


def generate_id():
    return ''.join([random.choice(string.ascii_letters
                                  + string.digits) for n in range(ID_LEN)])


def glob_files(image_path):

    def format_file_path(image_path):
        base_path = os.path.split(os.path.dirname(image_path))[1]
        base_name = os.path.basename(image_path)

        return "{}/{}".format(base_path, base_name)

    if image_path == None:
        return None

    files = map(format_file_path, glob(image_path[0]))

    return list(files)


def csv_to_dict(csv_data):
    data = dict(csv_data)

    path = data.pop("path")
    title = data.pop("title")
    description = data.pop("description")

    developer_name = data.pop("developer.name")
    developer_duration = data.pop("developer.duration")
    geo_latitude = data.pop("geo.latitude")
    geo_longitude = data.pop("geo.longitude")
    geo_place = data.pop("geo.place")

    data.update([
        ("aperture", data.aperture and float(data.aperture) or None),
        ("focal_length", data.focal_length and int(data.focal_length) or None),
        ("shutter", data.shutter and float(data.shutter) or None)
    ])

    if developer_name and developer_duration:
        data.update(
            [("developer", {"duration": float(developer_duration), "name": developer_name})])

    if geo_latitude and geo_longitude and geo_place:
        data.update([("geo", {
            "latitude": float(geo_latitude),
            "longitude": float(geo_longitude),
            "place": geo_place
        })])

    return {
        "description": description,
        "meta": data,
        "path": path,
        "title": title
    }


def write_json(csv_path, json_path):
    def transform_csv():
        data = []
        with open(csv_path, 'r', newline='') as csv_file:
            image_data = DictReader(csv_file)
            for i, row in enumerate(image_data):
                row_data = csv_to_dict(row)
                row_data.update([
                    ("id", generate_id())
                ])
                data.append(row_data)

            return data

    data = transform_csv()

    with open(json_path, 'w') as json_file:
        json.dump(data, json_file)


parser = create_argument_parser()
args = parser.parse_args()
