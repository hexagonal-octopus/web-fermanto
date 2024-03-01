const gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	jshint = require('gulp-jshint');

const jshints = () => {
	return gulp
		.src('src/scripts/*.js')
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.pipe(gulp.dest('./public/assets/scripts'));
};

gulp.task('jshints', jshints);
