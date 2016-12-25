var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps');


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

