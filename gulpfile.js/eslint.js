const { src } = require('gulp');
const gulpESLint = require('gulp-eslint');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const CONSTS = require('./CONSTS');

function lint() {
    return src([CONSTS.GULPFILE, CONSTS.GULP_TASKS + '/**/*.js', CONSTS.JS_SRC + '/**/*.js'])
        .pipe(gulpPlumber({ errorHandler: gulpNotify.onError('ESLint Error: <%= error.message %>') }))
        .pipe(gulpESLint())
        .pipe(gulpESLint.format())
        .pipe(gulpESLint.failAfterError());
}

module.exports = lint;
