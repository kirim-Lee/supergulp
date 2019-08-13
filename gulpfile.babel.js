import gulp from "gulp";
import pug from "gulp-pug";

const routes = {
  pug: {
    src: "src/**/*.pug",
    dest: "build"
  }
};
export const buildHTML = () =>
  gulp
    .src(routes.pug.src)
    .pipe(pug())
    .pipe(gulp.dest(routes.pug.dest));

export const dev = gulp.series(buildHTML);
