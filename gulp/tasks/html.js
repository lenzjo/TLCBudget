var gulp				= require('gulp');

var DIST_DIR		= './public';


gulp.task('html', function() {
	return gulp
		.src('./src/**/*.html')
		.pipe(gulp.dest(DIST_DIR));
});