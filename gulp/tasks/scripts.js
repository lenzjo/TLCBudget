var gulp           = require('gulp'),
    concat         = require('gulp-concat'),
    sourcemaps     = require('gulp-sourcemaps'),
    eslint        = require('gulp-eslint'),
    uglify         = require('gulp-uglify');


var DIST_DIR = './public';


gulp.task('scripts', function () {
  return gulp
    .src(
      [
        './src/js/modules/storage.js',
        './src/js/modules/model.js',
        './src/js/modules/view.js',
        './src/js/modules/users.js',
        './src/js/modules/controller.js',
        './src/js/app.js'
      ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DIST_DIR));
});


gulp.task('build:scripts', function () {
  return gulp
    .src(
      [
        './src/js/modules/storage.js',
        './src/js/modules/model.js',
        './src/js/modules/view.js',
        './src/js/modules/users.js',
        './src/js/modules/controller.js',
        './src/js/app.js'
      ])
//    .pipe(jshint())
//    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(DIST_DIR));
});
