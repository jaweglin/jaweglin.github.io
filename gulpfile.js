var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    cssnext = require('postcss-cssnext'),
    atImport = require('postcss-import'),
    mqpacker = require('css-mqpacker'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    cssnano = require('cssnano'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data');

gulp.task('css', function () {
  var processors = [
    atImport,
    cssnext,
    mqpacker,
    cssnano
  ];
  return gulp.src('app/src/css/*.css')
    .pipe(postcss(processors))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('app/dest'));
});

gulp.task('nunjucks', function() {
  return gulp.src('app/pages/*.njk')
    // Adding data to Nunjucks
    .pipe(data(function() {
      return require('./data.json')
    }))
    .pipe(nunjucksRender({
      path: ['app/pages/', 'app/templates/'] // String or Array
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('browser-sync', function() {
     browserSync({
          server: {
                baseDir: "./app"
          }
     });
});

gulp.task('scripts', function() {
    return gulp.src('app/src/js/*.js')
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/dest'))
        .pipe(reload({stream:true}));
});

gulp.task('images', function() {
  return gulp.src('app/src/img/**/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('app/dest/img'))
});

gulp.task('watch', function() {
    gulp.watch('app/templates/**/*.+(njk)', ['nunjucks', reload]);
    gulp.watch('app/**/*.+(njk)', ['nunjucks', reload]);
    gulp.watch('app/src/**/*.css', ['css', reload]);
    gulp.watch(['app/src/js/**/*.js','main.js'], ['scripts', reload]);
    gulp.watch('app/src/img/**/*', ['images']);
    gulp.watch("*.html", reload);
});

//* TODO: Pipe fonts to dest folder *//
gulp.task('default', ['nunjucks', 'css', 'scripts', 'browser-sync', 'watch']);
