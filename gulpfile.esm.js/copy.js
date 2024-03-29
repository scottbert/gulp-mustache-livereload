// const CONSTS = require('./CONSTS');
// const { src, dest } = require('gulp');
// const gulpChanged = require('gulp-changed');
// const gulpIf = require('gulp-if');
// const gulpLivereload = require('gulp-livereload');
import { notify } from './notify';
import { src, dest } from 'gulp';
import gulpChanged from 'gulp-changed';
import gulpIf from 'gulp-if';
import gulpPlumber from 'gulp-plumber';
import gulpLivereload from 'gulp-livereload';
import { CONSTS } from './CONSTS';

const STATIC_SRC = [CONSTS.JSON_SRC + '/**', CONSTS.IMG_SRC + '/**', CONSTS.FONT_SRC + '/**', CONSTS.VIDEO_SRC + '/**'];

function copyStaticFiles() {
    return copyFilesFn(STATIC_SRC, CONSTS.STATIC_PATH, CONSTS.SRC, true);
}

function copyFilesFn(srcdir, destdir, base, reload) {
    return src(srcdir, { base: base || '.' })
        .pipe(
            gulpPlumber({
                errorHandler: notify('copy error: <%= error.message %>')
            })
        )
        .pipe(gulpChanged(destdir))
        .pipe(dest(destdir))
        .pipe(gulpIf(reload, gulpLivereload({
            port: CONSTS.LIVERELOAD_PORT
        })));
}

function copyDeploy() {
    return src([CONSTS.DIST_DEST + '/**/*'], { base: 'dist' })
        .pipe(dest(CONSTS.DEPLOY_DEST));
}

export {
    copyStaticFiles,
    copyDeploy
};
