var gulp = require('gulp');
var concat = require('gulp-concat');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');

var pkg = require('./package.json');

var banner = ['/*!',
  ' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>',
  ' * Copyright 2015 <%= pkg.author %>',
  ' * license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('default', ['test']);

gulp.task('watch', ['scripts', 'styles'], function() {
  gulp.watch('src/**/*.js', ['scripts']);
  gulp.watch('src/**/*.css', ['styles']);
});

gulp.task('scripts', function() {
  return gulp.src(['src/scripts/element.js', 'src/scripts/**/*.js'])
    .pipe(concat('color-palette.js'))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('release'))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(rename('color-palette.min.js'))
    .pipe(gulp.dest('release'));
});

gulp.task('styles', function() {
  return gulp.src('src/styles/**/*.css')
    .pipe(concat('color-palette.css'))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('release'))
    .pipe(cssmin())
    .pipe(rename('color-palette.min.css'))
    .pipe(gulp.dest('release'));
});

gulp.task('test', ['watch'], function() {
  gulp.src('./')
    .pipe(webserver({
      port: 3000,
      open: 'http://localhost:3000/test'
    }));
});
