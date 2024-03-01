const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const del = require('del');
const usemin = require('gulp-usemin');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const prettify = require('gulp-pretty-html');
const cache = require('gulp-cache');
// const rev = require('gulp-rev');

const previewDist = () => {
   browserSync.init({
      port: 9000,
      server: {
         baseDir: 'dist'
      }
   })
};
previewDist.description = 'preview dist folder with browser-sync';
gulp.task('previewDist', previewDist);

const deleteDist = () => {
   return del('./dist');
};
deleteDist.description = 'delete dist folder';

const copyGeneralFiles = () => {
   const pathToCopy = [
      './src/**/*',
      '!./src/**/*.html',
      '!./src/assets/scripts/modules/**',
      '!./src/assets/scripts/*.js',
      '!./src/assets/images/**',
      '!./src/assets/scss/**',
      '!./src/assets/svg/**',
      '!./src/temp',
      '!./src/temp/**',
      '!./src/templates',
      '!./src/templates/**',
      '!./src/assets/libs/**'
   ];

   return gulp.src(pathToCopy)
      .pipe(gulp.dest('./dist'));
}
copyGeneralFiles.description = 'copy useful file to dist folder';

const initUsemin = () => {
   return gulp.src('./src/**/*.html')
      .pipe(usemin({
         // using Version hash:base64
         // css: [function() {return rev()}, function() {return cssnano()}],
         // js:[function(){return rev()}, function() {return uglify()}]
         css: [function() {return cssnano()}]
         // js:[function() {return uglify()}]
      }))
      .pipe(gulp.dest('./dist'));
};
initUsemin.description = 'minified scripts and styles and stored in dist/assets folder'

const optimizeImages = () => {
   return gulp.src('./src/assets/images/**/*')
      .pipe(cache(imagemin({
            progressive: true,
            interlaced: true,
            multipass: true
         })))
      .pipe(gulp.dest('./dist/assets/images'));
};
optimizeImages.description = 'optimized image to reduce filesizes';

const prettifyHTML = () => {
   return gulp.src('./dist/**/*.html')
      .pipe(prettify({
         indent_size: 3,
         unformatted: ['code', 'pre', 'em', 'b', 'br', 'strong']
      }))
      .pipe(gulp.dest('./dist'))
}

// gulp.task('build', gulp.series('icons', 'compileMarkup', 'compileStyles', 'compileScripts', deleteDist, copyGeneralFiles, optimizeImages, initUsemin, prettifyHTML));

gulp.task('build', gulp.series('icons', 'compileMarkup', 'compileStyles', 'modernizr', deleteDist, copyGeneralFiles, optimizeImages, initUsemin, prettifyHTML));

