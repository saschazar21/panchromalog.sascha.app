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
 - alt (string)
 - aperture (float)
 - camera (string)
 - date (string) -- date in ISO string
 - focal_length (int)
 - shutter (float)

Optional fields are the following:
 - id (int) -- will be overwritten in the process, may support in keeping track of the image data
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


class ImageData:
    def __init__(self):
        parser = create_argument_parser()
        self.args = parser.parse_args()
        self.images = self.create_image_dict()

    def create_image_dict(self):
        images = self.glob_files()

        if images == None:
            return None

        image_dict = {}

        for image in images:
            i = int(list(filter(str.isdigit, os.path.basename(image))))
            image_dict.update([(i, image)])

        return image_dict

    def glob_files(self):

        def format_file_path(image_path):
            base_path = os.path.split(os.path.dirname(image_path))[1]
            base_name = os.path.basename(image_path)

            return "{}/{}".format(base_path, base_name)

        if self.args.images == None:
            print("No image glob pattern given, CSV-file won't be filtered!")
            return None

        files = map(format_file_path, glob(self.args.images[0]))

        print("Found {} images using glob pattern \"{}\"".format(
            len(files)), self.args.images)

        return list(files)

    def csv_to_dict(row_data):
        data = dict(row_data)

        data.pop("id")
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
            "title": title
        }

    def write_json(self):
        def transform_csv():
            data = []
            with open(self.args.file, 'r', newline='') as csv_file:
                image_data = DictReader(csv_file)
                for i, row in enumerate(image_data):
                    if self.images and self.images.get(i + 1) == None:
                        continue

                    row_data = self.csv_to_dict(row)
                    row_data.update([
                        ("id", generate_id()),
                        ("path", self.images.get(i + 1))
                    ])
                    data.append(row_data)

                return data

        data = transform_csv()

        with open(self.args.output, 'w') as json_file:
            json.dump(data, json_file)

            print("Transformed {} image data entries and exported them to JSON.".format(
                len(data)))


image_data = ImageData()
image_data.write_json()
