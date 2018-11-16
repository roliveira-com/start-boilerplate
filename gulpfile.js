var gulp        = require('gulp'),
    ejs         = require('gulp-ejs'),
    sass        = require('gulp-sass'),
    gutil       = require('gulp-util'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    connect     = require('gulp-connect'),
    minifycss   = require('gulp-clean-css'),
    sourcemaps  = require('gulp-sourcemaps');

gulp.task('copy-files', function() {
    // copy any html files in source/ to public/
    return gulp.src(['source/fonts'])
        .pipe(gulp.dest('public'))
        .pipe(connect.reload());
});

gulp.task('compile-templates', function(){
    return gulp.src('source/views/pages/*.ejs')
        .pipe(ejs({ msg: 'Hello Gulp!'}, {}, { ext: '.html' }))
        .pipe(gulp.dest('./public'))
        .pipe(connect.reload());
});

gulp.task('vendor-js', function() {
    return gulp.src(['source/vendor/js/jquery.js','source/vendor/js/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/assets/javascript'))
        .pipe(connect.reload());
});

gulp.task('build-js', function() {
    return gulp.src('source/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/assets/javascript'))
        .pipe(connect.reload());
}); 

gulp.task('vendor-css', function() {
    return gulp.src('source/vendor/**/*.css')
        .pipe(concat('vendor.css'))
        .pipe(gutil.env.type === 'production' ? minifycss() : gutil.noop()) 
        .pipe(gulp.dest('public/assets/stylesheets'))
        .pipe(connect.reload());
});

gulp.task('build-css', function() {
    return gulp.src('source/sass/app.scss')
        .pipe(sourcemaps.init()) 
        .pipe(sass())
        .pipe(gutil.env.type === 'production' ? minifycss() : gutil.noop()) 
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/assets/stylesheets'))
        .pipe(connect.reload());
});

gulp.task('web-server', function () {
    connect.server({
      name: 'App',
      root: 'public',
      port: 8001,
      livereload: true
    });
  });

// gulp.task('default', ['copy-files', 'web-server', 'watch']);

gulp.task('default', ['copy-files', 'compile-templates', 'vendor-js', 'build-js', 'vendor-css', 'build-css']);

gulp.task('dev', ['default', 'web-server', 'watch']);

gulp.task('watch', function() {
    gulp.watch('source/vendor/js/**/*.js', ['vendor-js']);
    gulp.watch('source/js/**/*.js', ['build-js']);
    gulp.watch('source/vendor/css/**/*.css', ['vendor-css']);
    gulp.watch('source/sass/**/*.scss', ['build-css']);
    gulp.watch('source/views/**/*.ejs', ['compile-templates']);
    gulp.watch('source/*', ['copy-files']);
});