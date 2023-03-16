from argparse import ArgumentParser
import pandas as pd


class ExcelToCSV:
    def __init__(self):
        self.args = self.parse_args()

    def parse_args(self):
        parser = ArgumentParser(
            description="Converts an Excel file into a CSV file")
        parser.add_argument("file", metavar="EXCEL", nargs=1,
                            help="The Excel file to convert to CSV")
        parser.add_argument("--output", "-o", metavar="CSV", nargs=1,
                            default=["out.csv"], help="The CSV file output path")

        return parser.parse_args()

    def convert(self):
        read_file = pd.read_excel(self.args.file[0])

        read_file.to_csv(self.args.output[0], index=None, header=True)


if __name__ == "__main__":
    converter = ExcelToCSV()

    converter.convert()
