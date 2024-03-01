const gulp = require('gulp');
const wait = require('gulp-wait');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const gutil = require('gulp-util');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');

const env = process.env.NODE_ENV;

var onError = function(error) {
	console.log(error.toString());
	gutil.beep();
	this.emit('end');
};

const compileStyles = () => {
	return gulp
		.src('./src/scss/**/*.scss')
		.pipe(wait(500))
		.pipe(
			plumber({
				errorHandler: onError
			})
		)
		.pipe(gulpIf(env === 'development', sourcemaps.init()))
		.pipe(
			sass({
				outputStyle: 'expanded'
			})
		)
		.pipe(
			autoprefixer({
				browsers: ['last 3 versions'],
				cascade: false
			})
		)
		.pipe(gulpIf(env === 'development', sourcemaps.write('../maps')))
		.pipe(gulp.dest('./public/assets/styles'));
};
compileStyles.description = 'Compile scss into css';

gulp.task('compileStyles', compileStyles);
