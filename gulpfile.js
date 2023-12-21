const { src, dest } = require('gulp');
const concat = require('gulp-concat');
const pkgJson = require('./package.json');
var gulp = require("gulp"),
    rename = require("gulp-rename"),terser = require("gulp-terser");

const jsBundle = () =>
  src([
    '01-wized-filters.js',
    '02-wized-filter-clear.js',
    '03-wized-filter-clear-reset-visibility.js',
    '04-wized-filter-clear-reset-visibility-trigger.js',
    '05-wized-filter-search.js',
    '06-wized-filter-range.js',
    '07-wized-filter-category-tag.js',
    '08-wized-filter-empty-state.js',
  ])
    .pipe(concat(`wized-filter@${pkgJson.version}.js`))
    .pipe(dest('dist/js'));

    // Looks for a file called app.js inside the js directory
// Copies and renames the file to app.min.js
// Minifies the JS
// Saves the new file inside the js directory
const minifyJS = () => {
    return gulp.src(`./dist/js/wized-filter@${pkgJson.version}.js`)
      .pipe(rename(`wized-filter-app@${pkgJson.version}.min.js`))
      .pipe(terser())
      .pipe(gulp.dest("./js"));
  }
  
  exports.jsBundle = jsBundle;
  exports.minifyJS = minifyJS;