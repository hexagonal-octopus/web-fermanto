const gulp = require('gulp');
const path = require('path');
const del = require('del');
const npmDist = require('gulp-npm-dist');
const rename = require('gulp-rename');
const deleteEmpty = require('delete-empty');

// Gulp 3.9
// gulp.task('cleanLibs', function() {
//    return del('./src/assets/libs')
// })

const cleanLibs = () => {
	return del('./src/libs');
};
cleanLibs.description = 'clean libs folder';

const importLibs = () => {
	return gulp
		.src(
			npmDist({
				copyUnminified: true,
				excludes: [
					'**/*.txt',
					'test',
					'lib',
					'docs',
					'source',
					'source/**/*',
					'*.json',
					'**/*.zip',
					'src',
					'shortcuts',
					'shortcuts/**/*'
				]
			}),
			{ base: './node_modules/' }
		)
		.pipe(
			rename(function(path) {
				path.dirname = path.dirname
					.replace(/\/dist/, '')
					.replace(/\\dist/, '');
			})
		)
		.pipe(gulp.dest('./src/libs'));
};
importLibs.description = 'importing library from node_modules';

const distributeFontLibs = () => {
	return gulp
		.src('./src/libs/**/*.{ttf,woff,woff2,eot,otf}')
		.pipe(gulp.dest('./public/assets/fonts/vendor'));
};

const distributeJSLibs = () => {
	return gulp
		.src('./src/libs/**/*.js')
		.pipe(gulp.dest('./public/assets/scripts/vendor'));
};

const distributeImageLibs = () => {
	return gulp
		.src('./src/libs/**/*.{jpg,png,gif,cur}')
		.pipe(gulp.dest('./public/assets/images/vendor'));
};

const distributeStyleLibs = () => {
	return gulp
		.src('./src/libs/**/*.css')
		.pipe(gulp.dest('./public/assets/styles/vendor'));
};

const removeEmptyDir = done => {
	deleteEmpty.sync('./public/assets');
	done();
};

const distributeAssetLibs = gulp.parallel(
	distributeFontLibs,
	distributeImageLibs,
	distributeStyleLibs,
	distributeJSLibs
);

const libs = gulp.series(
	cleanLibs,
	importLibs,
	distributeAssetLibs,
	removeEmptyDir
);

gulp.task('libs', libs);
