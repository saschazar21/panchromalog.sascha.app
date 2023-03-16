<div align="center">
  <img alt="The icon of the website, showing stylized film perforations surrounding stylized diaphragm blades" src="public/img/rounded-512.png" width="192px" />
  <br />
  <h1><a href="https://panchromalog.sascha.app">Panchromalog</a></h1>
  <strong>This is Sascha's collection of analog photographs. 📸🎞️</strong>
  <br />
  <br />
  <a href="https://github.com/saschazar21/panchromalog.sascha.app/actions/workflows/deploy.yml"><img alt="GitHub Actions: Deploy workflow" src="https://github.com/saschazar21/panchromalog.sascha.app/actions/workflows/deploy.yml/badge.svg" /></a> <a href="https://github.com/saschazar21/panchromalog.sascha.app/actions/workflows/build-and-test.yml"><img alt="GitHub Actions: Test workflow" src="https://github.com/saschazar21/panchromalog.sascha.app/actions/workflows/build-and-test.yml/badge.svg" /></a> <img alt="License" src="https://img.shields.io/github/license/saschazar21/panchromalog.sascha.app" />
  <br />
  <br />
  <br />
</div>

## What is it?

This repository contains the source code of my [Panchromalog website](https://panchromalog.sascha.app), a collection of my analog photographs, built using [Astro](https://astro.build) and [Preact](https://preactjs.com).

## Getting started

### Prerequisites

The following prerequisites are needed to successfully launch this project locally:

#### Runtimes

- [Node.js v18+](https://nodejs.org/en/)

- [Yarn](https://yarnpkg.dev/) or similar (optional)
- [Python](https://www.python.org/) - for generating the JSON payload for the API (optional)
- [Postman](https://www.postman.com/) - for interacting with the API (optional)

#### Accounts

- An [ImageKit](https://imagekit.io/) account for storing images.
- A [GraphQL](https://graphql.org/)-compatible API endpoint for storing the image metadata.
  - I use [Fauna](https://fauna.com/) - for other services, the environment variables may need to be adjusted accordingly in the source code.

### Quick start

1. Copy `.env.sample` to `.env` and populate the environment variables

   ```bash
   cp .env.sample .env
   ```

2. Install dependencies

   ```bash
   yarn # or npm install
   ```

3. Run development preview

   ```bash
   yarn dev # or npm run dev
   ```

## Deployment

### Prerequisites

- A [Netlify](https://netlify.com) account

  - Astro supports other integrations as well - check the docs for more information: https://docs.astro.build/en/guides/integrations-guide/. Adapt the `astro.config.mjs` configuration accordingly.

- Access to [GitHub Actions](https://docs.github.com/en/actions) for benefitting from an automated deployment integration (optional)
  - If used, environment variables listed in `.env.sample` need to be set in the repository settings at GitHub accordingly.

## Python script

This repository contains a Python script located at `./bin/generate_image_data.py`, for transforming image metadata.

ℹ️ **No external dependencies needed**, the script consists entirely of internal Python libraries.

### Usage

It takes a `.csv` file in the format of [template.csv](./template.csv) and transforms it into a `.json` file. Optionally, a given list of image files in a numbered format (e.g. `IMG_001.jpg`) will be used to filter entries in the `.csv` file. It doesn't matter if files are missing in the sequence, only their file names need to be parseable into integers (e.g. `IMG_005.jpg` -> `5`).

The output may be used to bulk-upload new image entries using the `createImages` mutation in the [Postman collection](./postman.json).

```bash
# Compare existing image files against the entries in the .csv file and generate a .json file
./bin/generate_image_data.py -i some_image_data.csv -o some_image_data.json ./some_image_folder/*.jpg
```

### Workflow

1. Prepare a folder containing desired image files.
2. Run script using a `.csv` file containing corresponding metadata for the selected files.
3. Upload image folder to ImageKit.
4. Upload resulting `.json` file contents to GraphQL API

## License

Licensed under the MIT license.

Copyright ©️ 2023 [Sascha Zarhuber](https://sascha.work)
