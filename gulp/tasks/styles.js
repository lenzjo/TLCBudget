var gulp        = require('gulp'),
    plugins     = require('gulp-load-plugins')();


var DIST_DIR    = './public';


gulp.task('styles', function() {
  return gulp
    .src('./src/sass/main.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      outputStyle: 'expanded'
    })
    .on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(plugins.rename('styles.css'))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('build:styles', function() {
  return gulp
    .src('./src/sass/main.scss')
    .pipe(plugins.sass()
    .on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(plugins.rename('styles.css'))
    .pipe(plugins.cssnano())
    .pipe(gulp.dest(DIST_DIR))
    .resume();
});
