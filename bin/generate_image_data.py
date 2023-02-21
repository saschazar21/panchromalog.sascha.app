#!/usr/bin/env python

from argparse import ArgumentParser
from glob import glob
import os

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

def create_argument_parser():
  parser = ArgumentParser(description="Maps a CSV- into a JSON-file based on existing source images.\nIf no images are found, the CSV file will be considered as single source of truth.")

  parser.add_argument('file', metavar="CSV", nargs=1, help="the CSV file to map into JSON")
  parser.add_argument('-i', '--images', metavar="DIR", nargs=1, help="path pointing to the source images")
  parser.add_argument('-o', '--output', metavar="JSON", required=True, nargs=1, help="path pointing to the output location of the generated JSON-file")

  return parser


def format_file_path(image_path):
  base_path = os.path.split(os.path.dirname(image_path))[1]
  base_name = os.path.basename(image_path)

  return "{}/{}".format(base_path, base_name)

def glob_files(image_path):
  if image_path == None:
    return None

  files = map(format_file_path, glob(image_path[0]))

  return list(files)

parser = create_argument_parser()
args = parser.parse_args()
print(glob_files(args.images))