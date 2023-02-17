#!/usr/bin/env python

from argparse import ArgumentParser

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

  parser.add_argument('file', metavar="PATH_TO_CSV", nargs=1, help="the CSV file to map into JSON")
  parser.add_argument('-i', '--images', metavar="DIR", nargs=1, help="path pointing to the source images")
  parser.add_argument('-o', '--output', metavar="PATH_TO_JSON", required=True, nargs=1, help="path pointing to the output location of the generated JSON-file")

  return parser


parser = create_argument_parser()
args = parser.parse_args()