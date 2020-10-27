const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');

const babelRc = require('./.babelrc');


function buildCjs() {
  return gulp
    .src('src/**/*.js', {
      ignore: 'src/__tests__/**',
    })
    .pipe(babel(babelRc))
    .pipe(gulp.dest('cjs'));
}

function copyFlow() {
  return gulp
    .src('src/**/*.js', {
      ignore: 'src/__tests__/**',
    })
    .pipe(
      rename(path => {
        path.extname = path.extname + '.flow';
      }),
    )
    .pipe(gulp.dest('cjs'));
}

module.exports.build = gulp.parallel(buildCjs, copyFlow);
