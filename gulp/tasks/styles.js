var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    srcmaps     = require('gulp-sourcemaps'),
    autoprefix  = require('gulp-autoprefixer'),
    rename      = require('gulp-rename'),
    sassdoc     = require('sassdoc'),
    cssnano     = require('gulp-cssnano');

var DIST_DIR    = './public';


gulp.task('styles', function() {
  return gulp
    .src('./src/sass/main.scss')
    .pipe(srcmaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    })
    .on('error', sass.logError))
    .pipe(autoprefix({
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(rename('styles.css'))
    .pipe(srcmaps.write('./'))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('build:styles', function() {
  return gulp
    .src('./src/sass/main.scss')
    .pipe(sass()
    .on('error', sass.logError))
    .pipe(autoprefix({
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(rename('styles.css'))
    .pipe(cssnano())
    .pipe(gulp.dest(DIST_DIR))
//    .pipe(sassdoc())
    .resume();
});
