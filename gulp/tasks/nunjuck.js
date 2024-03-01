const gulp = require('gulp');
const dateFilter = require('nunjucks-date-filter');
const plumber = require('gulp-plumber');
const nunjucksRender = require('gulp-nunjucks-render');
const browserSync = require('browser-sync').create();
const data = require('gulp-data');
const del = require('del');

const manageEnvironment = function(env) {
	env.addFilter('date', dateFilter);
};

const createMarkup = () => {
	return (
		gulp
			.src('./src/pages/**/*.njk')
			.pipe(plumber())
			// .pipe(
			// 	data(function() {
			// 		return require('../../data/data.json');
			// 	})
			// )
			.pipe(
				nunjucksRender({
					path: ['./src/templates'],
					manageEnv: manageEnvironment
				})
			)
			.pipe(gulp.dest('./public'))
	);
};
createMarkup.description = 'Create HTML from Nunjucks';

const deleteOldMarkup = () => {
	return del('./public/**/*.html');
};
deleteOldMarkup.description = 'delete obsolete HTML from Nunjucks';

const compileMarkup = gulp.series(deleteOldMarkup, createMarkup);

gulp.task('compileMarkup', compileMarkup);
