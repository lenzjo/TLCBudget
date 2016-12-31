var gulp           = require('gulp'),
    plugin         = require('gulp-load-plugins')();



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
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.concat('app.js'))
    .pipe(plugin.sourcemaps.write('./'))
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
    .pipe(plugin.eslint())
    .pipe(plugin.eslint.format())
    .pipe(plugin.concat('app.js'))
    .pipe(plugin.uglify())
    .pipe(gulp.dest(DIST_DIR));
});
