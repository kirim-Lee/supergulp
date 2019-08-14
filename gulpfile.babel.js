import gulp from "gulp";
import ws from "gulp-webserver";
import pug from "gulp-pug";
import del from "del";
import image from "gulp-image";
import sass from "gulp-sass";
import autoPrefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";

sass.compiler = require("node-sass");

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build"
  },
  img: {
    src: "src/img/*",
    dest: "build/img"
  },
  scss: {
    watch: "src/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css"
  },
  js: {
    watch: "src/js/*.js",
    src: "src/js/main.js",
    dest: "build/js"
  }
};

const buildHTML = () =>
  gulp
    .src(routes.pug.src)
    .pipe(pug())
    .pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build"]);

const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, buildHTML);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }]
        ]
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const img = () =>
  gulp
    .src(routes.img.src)
    .pipe(image())
    .pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoPrefixer())
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const prepare = gulp.series(clean, img);

const assets = gulp.series(buildHTML, styles, js);

const postDev = gulp.parallel(webserver, watch);

export const dev = gulp.series(prepare, assets, postDev);
