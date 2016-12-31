var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    browserSync = require('browser-sync').create();

var DIST_DIR    = './public';


gulp.task('watch', function() {

  browserSync.init({
    notify: false,
    server: {
      baseDir: DIST_DIR
    }
  });

  watch('./src/**/*.html', function() {
    gulp.start('html');
  });

  watch('./src/sass/**/*.scss', function() {
    gulp.start('cssInject');
  });

  watch('./src/js/**/*.js', function () {
    gulp.start('scripts');
  });

  watch('./public/**/*.html', function() {
    browserSync.reload();
  });

  watch('./public/app.js', function() {
    browserSync.reload();
  });
});


gulp.task('cssInject', ['styles'], function() {
  return gulp
    .src('./public/styles.css')
    .pipe(browserSync.stream());
});




