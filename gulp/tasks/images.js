var gulp         = require('gulp');

var DIST_DIR = './public';


// Just copy the html to the dist folder
gulp.task('images', function () {
  return gulp
    .src('./src/img/*.png')
    .pipe(gulp.dest(DIST_DIR));
});
