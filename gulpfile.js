var gulp = require("gulp");
var terser = require("gulp-terser");
var eslint = require("gulp-eslint");

function qualidadeCodigo (cb) {
    gulp.src([
        './configuracoes/*.js',
        './app/**/*.js'])
    .pipe(eslint({
        configFile: '.eslintrc'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

    cb();
}

function minificarApp(cb) {
    gulp.src('./app/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('./build/app'));

    cb();
}

function minificarConfiguracoes(cb) {
    gulp.src('./configuracoes/*.js')
    .pipe(terser())
    .pipe(gulp.dest('./build/configuracoes'));

    cb();
}

exports.eslint = gulp.series(qualidadeCodigo);
exports.build = gulp.series(qualidadeCodigo, minificarConfiguracoes, minificarApp);