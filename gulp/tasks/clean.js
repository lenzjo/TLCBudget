var gulp        = require('gulp'),
    del         = require('del');

var DIST_DIR    = './public';


gulp.task('clean', function() {
  return del(DIST_DIR + '/*');
});
