const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();

// Пути
const paths = {
  scss: "./styles/**/*.scss",
  scssOutput: "./styles/index.scss",
  css: "./styles/",
  html: "./**/*.html",
  js: "./scripts/**/*.js",
};

// Компиляция SCSS → CSS
function styles() {
  return gulp
    .src(paths.scssOutput)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
}

// Сервер + слежка
function serve() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    notify: false,
  });

  gulp.watch(paths.scss, styles);
  gulp.watch(paths.html).on("change", browserSync.reload);
  gulp.watch(paths.js).on("change", browserSync.reload);
}

exports.styles = styles;
exports.serve = gulp.series(styles, serve);
exports.default = gulp.series(styles, serve);
