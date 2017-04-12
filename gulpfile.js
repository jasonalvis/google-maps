/*
 * Name: Google Maps
 * Author: Jason Alvis
 * Author URI: http://jasonalvis.co.uk
 * Description: Google Maps JavaScript Plugin
 * Version: 0.0.1
 */

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var notify      = require('gulp-notify');
var rename      = require("gulp-rename");
var eslint      = require('gulp-eslint');
var uglify      = require('gulp-uglify');

/*
 * JavaScript linting
 */

gulp.task('js-lint', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()
    .on('error', notify.onError('JS lint failed.\n<%= error.message %>')));
});

/*
 * JavaScript minify
 */

gulp.task('js', ['js-lint'], function() {
  return gulp.src('src/js/**/*.js')
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(rename({ 
      suffix: '.min' 
    }))
    .pipe(gulp.dest('public/js'));
});

/*
 * JavaScript watch
 * Ensures the 'js' task is complete before reloading browsers
 */

gulp.task('js-watch', ['js'], browserSync.reload);

/*
 * Serve
 */

gulp.task('serve', ['js'], function() {
  browserSync.init({
    server: {
      baseDir: './public'
    },
    notify: false
  });

  gulp.watch('src/js/**/*.js', ['js-watch']);
  gulp.watch('public/**/*.html', browserSync.reload);
});

/*
 * Tasks
 */

gulp.task('default', ['js', 'serve'], browserSync.reload);
