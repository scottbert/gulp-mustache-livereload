import { notify } from './notify';
import { src, dest } from 'gulp';
import cssMqpacker from 'css-mqpacker';
import cssnano from 'cssnano';
import gulpIf from 'gulp-if';
import gulpLivereload from 'gulp-livereload';
import gulpPlumber from 'gulp-plumber';
import gulpPostcss from 'gulp-postcss';
import gulpRename from 'gulp-rename';
import gulpSass from 'gulp-dart-sass';
import gulpSassVariables from 'gulp-sass-variables';
import postcssAssets from 'postcss-assets';
import postcssImport from 'postcss-import';
import postcssNormalize from 'postcss-normalize';
import postcssPresetEnv from 'postcss-preset-env';

import { CONSTS } from './CONSTS';

const {
    NODE_ENV,
    BREAKPOINTS,
    NAME,
    COMPONENTS_SRC,
    VERSION,
    CSS_SRC_PATH,
    CSS_DEST_PATH,
    LIVERELOAD_PORT
} = CONSTS;

const isDev = NODE_ENV !== 'production';

const sassOptions = {
    errLogToConsole: true,
    includePaths: [
        COMPONENTS_SRC
    ]
};

const gulpOptions = isDev ? {
    sourcemaps: true
} : {};

function buildSassVariables(breakpoints) {
    let b;
    const c = {};

    for (b in breakpoints) {
        c['$' + b.toLowerCase().replace(/_/g, '')] = breakpoints[b] + 'px';
    }

    return c;
}

const sassVariables = buildSassVariables(BREAKPOINTS);

function rename(path) {
    path.basename =
        path.basename.replace('$name', NAME.replace(/ /gi, '-').toLowerCase()).replace('$version', VERSION) +
        '.min';
}

function compileSass() {
    const processors = [
        cssMqpacker,
        cssnano({
            preset: 'lite'
        }),
        postcssImport,
        postcssAssets,
        postcssNormalize,
        postcssPresetEnv
    ];

    return src(CSS_SRC_PATH + '/**/*.scss', gulpOptions)
        .pipe(gulpPlumber({ errorHandler: notify('Styles Error: <%= error.message %>') }))
        .pipe(gulpSassVariables(sassVariables))
        .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
        .pipe(gulpPostcss(processors))
        .pipe(gulpRename(rename))
        .pipe(dest(CSS_DEST_PATH, gulpOptions))
        .pipe(gulpIf(isDev, gulpLivereload({ port: LIVERELOAD_PORT })));
}

export { compileSass as sass };
