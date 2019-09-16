const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const server = require('browser-sync').create();
sass.compiler = require('node-sass');
const uncss = require('gulp-uncss');


gulp.task('style', () => {

  return gulp.src('./src/styles/*.scss')
  .pipe(plumber())
  .pipe(sass.sync().on('error', sass.logError))
.pipe(gulp.dest('./src/styles/'))
  .pipe(rename({suffix: ".min"}))
  .pipe(uncss({
    html: ['index.html', './src/*.html']
  }))
  .pipe(gulp.dest('./src/styles/'))
  .pipe(server.stream());
});

gulp.task('images', () => {
  return gulp.src("src/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest('src/img'))
});

gulp.task('webp', () => {
  return gulp.src('src/img/**/*.{png,jpg}')
  .pipe(webp({quality:90}))
  .pipe(gulp.dest('src/img'));
});

gulp.task('serve', () => {
  server.init({
    server: "./src/"
  });
  gulp.watch('./src/styles/**.*{scss, css}', gulp.parallel('style')).on('change', server.reload);
  gulp.watch('./src/index.html').on('change', server.reload);

});



gulp.task('default', gulp.parallel('serve', 'style'));