var gulp         = require('gulp');


gulp.task('build', ['clean'], function() {
  gulp.start('html', 'build:scripts', 'build:styles', 'images');
});
