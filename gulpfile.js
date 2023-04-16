var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

gulp.task('default', function () {
  return gulp
    .src('./pages/**/*.less')
    .pipe(less())
    .pipe(
      rename(function (path) {
        path.extname = '.wxss';
      })
    )
    .pipe(gulp.dest('./pages'));
});

gulp.task('components', function () {
  return gulp
    .src('./components/**/*.less')
    .pipe(less())
    .pipe(
      rename(function (path) {
        path.extname = '.wxss';
      })
    )
    .pipe(gulp.dest('./components'));
});

gulp.task('familyPages', function () {
  return gulp
    .src('./familyPages/**/*.less')
    .pipe(less())
    .pipe(
      rename(function (path) {
        path.extname = '.wxss';
      })
    )
    .pipe(gulp.dest('./familyPages'));
});

gulp.task('teacherPages', function () {
  return gulp
    .src('./teacherPages/**/*.less')
    .pipe(less())
    .pipe(
      rename(function (path) {
        path.extname = '.wxss';
      })
    )
    .pipe(gulp.dest('./teacherPages'));
});

gulp.task('watch', function () {
  gulp.watch('./pages/**/*.less', gulp.series('default'));
  gulp.watch('./components/**/*.less', gulp.series('components'));
  gulp.watch('./familyPages/**/*.less', gulp.series('familyPages'));
  gulp.watch('./teacherPages/**/*.less', gulp.series('teacherPages'));
});
