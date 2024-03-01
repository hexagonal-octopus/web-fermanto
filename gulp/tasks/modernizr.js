const gulp = require('gulp'),
	modernizr = require('gulp-modernizr');

const createModernizr = () => {
	return gulp
		.src([
			'./public/assets/styles/**/*.css',
			'./public/assets/scripts/**/*.js'
		])
		.pipe(
			modernizr({
				options: ['setClasses']
			})
		)
		.pipe(gulp.dest('./public/assets/scripts/vendor'));
};
createModernizr.description = 'Create Modernizr Files';

gulp.task('modernizr', createModernizr);
