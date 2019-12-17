var gulp = require("gulp");
var terser = require("gulp-terser");

function minificarConfiguracoes(cb) {
    gulp.src('./configuracoes/*.js')
    .pipe(terser())
    .pipe(gulp.dest('./build/configuracoes'));

    cb();
}

module.exports = gulp.series(minificarConfiguracoes);