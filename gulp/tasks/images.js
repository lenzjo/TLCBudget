var gulp         = require('gulp'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant');



var DIST_DIR = './public';


// Just copy the html to the dist folder
gulp.task('images', function () {
  return gulp
    .src('./src/img/*.png')
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(DIST_DIR));
});
