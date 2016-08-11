import gulp from 'gulp';
import shell from 'gulp-shell';
import clean from 'gulp-clean';

gulp.task('setup-fonts', () => {
  return gulp
    .src(['resources/fonts/*'])
    .pipe(gulp.dest('./ios/hairfolio/fonts'));
});

gulp.task('setup-fontello-ios', shell.task('fontello-cli install --config fontello.json --css .tmp --font ./ios/hairfolio/fonts'));

gulp.task('setup-fontello', ['setup-fontello-ios'], () => {
  return gulp.src('.tmp', {read: false})
        .pipe(clean());
});
