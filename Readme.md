# How to run the project

You need to run following commands, to be able to make builds

*   `npm install --global gulp-cli`
*   `npm i`

This will install all the dependencies that are needed for making builds.

## How to make a build

*   do your changes in JS files 01-08
*   update version number on package.json
*   run following command `npm run combine`
*   run this after `npm run minify`

## Build

*   in `dist\js`, you will see combined files with new version
*   in `js`, you will find the minified version of the combined file. This file is intented for CDN distribution.