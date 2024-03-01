const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const scriptsRefresh = done => {
	browserSync.reload();
	done();
};

const watchMarkup = gulp.series('compileMarkup');
const watchStyles = gulp.series('compileStyles');
const watchScripts = gulp.series('jshints', scriptsRefresh);

const watchAll = () => {
	browserSync.init({
		port: 9000,
		server: {
			baseDir: 'public'
		}
	});

	gulp.watch('src/**/*.njk', gulp.series(watchMarkup));
	gulp.watch('public/**/*.html').on('change', browserSync.reload);
	gulp.watch('src/scss/**/*.scss', gulp.series(watchStyles));
	gulp.watch('public/assets/styles/*.css').on('change', browserSync.reload);
	gulp.watch('src/scripts/**/*.js', gulp.series(watchScripts));
};

gulp.task('watch', watchAll);
