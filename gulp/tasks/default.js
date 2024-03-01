const gulp = require('gulp');

const compileAll = gulp.series(
	'libs',
	'compileMarkup',
	'compileStyles',
	'modernizr',
	'jshints'
);

const defaultTask = gulp.series(compileAll, 'watch');

gulp.task('default', defaultTask);
