#!/usr/bin/env python

from argparse import ArgumentParser
from io import BytesIO
from PIL import Image
import blurhash
import json
import numpy as np
import os

MIN_HASH_COMPONENTS = 4
MIN_WIDTH = 128


class MeanColorHash:
    """Takes a list of image file paths as input and calculates the mean color and blurhash value for each given image file"""

    def __init__(self):
        self.args = self.parse_args()
        self.images = self.parse_image_paths()

    def parse_args(self):
        """Parses command-line arguments and returns a dictionary of parsed arguments"""

        parser = ArgumentParser(
            description="A tool to determine the mean color based on given images")
        parser.add_argument("images", metavar="IMAGE", nargs="+",
                            help="The images to calculate the mean color for")
        parser.add_argument("-o", "--output", metavar="OUTPUT", nargs=1, default=["./mean-color.json"],
                            help="The JSON file output which contians the mean color values")

        return parser.parse_args()

    def parse_image_paths(self):
        """Maps through given image paths and transforms them into directory/filename format"""

        def parse_image_path(path):
            directory = os.path.split(os.path.dirname(path))[1]
            basename = os.path.basename(path)
            return "{}/{}".format(directory, basename)

        parsed = map(parse_image_path, self.args.images)

        return list(parsed)

    def decode_images(self):
        """Loads images into memory and scales them down into small thumbnails"""

        def decode_image(path):
            with Image.open(path) as img:
                width, height = img.size
                factor = min(width, height) / max(width, height)
                new_width = width < height and min(MIN_WIDTH, max(MIN_WIDTH, width)) or min(
                    MIN_WIDTH / factor, max(MIN_WIDTH / factor, width))
                new_height = height < width and min(MIN_WIDTH, max(MIN_WIDTH, height)) or min(
                    MIN_WIDTH / factor, max(MIN_WIDTH / factor, height))

                img = img.resize((int(new_width), int(new_height)))

                return img

        images = map(decode_image, self.args.images)

        return list(images)

    def get_blurhash(self, img):
        """Calculates blurhash of given image object and returns hash string"""

        width, height = img.size
        factor = min(width, height) / max(width, height)

        x_components = width < height and MIN_HASH_COMPONENTS or int(
            MIN_HASH_COMPONENTS / factor)
        y_components = height < width and MIN_HASH_COMPONENTS or int(
            MIN_HASH_COMPONENTS / factor)

        b = BytesIO()
        img.save(b, "PNG")
        b.seek(0)

        hash = blurhash.encode(
            b, x_components=x_components, y_components=y_components)

        b.close()

        return hash

    def get_mean_color(self, img):
        """Calculates mean color of a given image object and returns numpy array containing RGB values"""

        width, height = img.size
        arr = np.array(img.getdata()).reshape(
            width, height, 3)

        mean = np.mean(arr, axis=(0, 1))
        return np.array(mean, copy=True, dtype=int)

    def write_file(self):
        """Loops through the decoded image files and calculates mean color and blurhash on the fly. Dumps the calculated contents into a JSON file"""

        color_list = []
        for i, img in enumerate(self.decode_images()):
            color = self.get_mean_color(img)
            color_string = '#%02x%02x%02x' % tuple(color)
            dict = {
                "color": color_string,
                "hash": self.get_blurhash(img),
                "path": self.images[i],
            }
            color_list.append(dict)

        with open(self.args.output[0], 'w') as output_file:
            json.dump(color_list, output_file)


if __name__ == "__main__":
    mean_color_hash = MeanColorHash()

    mean_color_hash.write_file()
