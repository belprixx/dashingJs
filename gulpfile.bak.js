var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    del = require('del'),
    symlink = require('gulp-sym'),
    source = './app',
    dist = './dist';

gulp.task('build-css', function () {
    return gulp.src(source + '/assets/sass/app.scss')
        .pipe(plugins.sass())
        .pipe(plugins.csscomb())
        .pipe(plugins.cssbeautify({indent: '  '}))
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(dist + '/assets/css/'))
        .pipe(plugins.livereload());
});

gulp.task('minify-css', function () {
    return gulp.src(dist + '/assets/css/app.css')
        .pipe(plugins.csso())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(dist + '/assets/css/'));
});

gulp.task('build-html', function () {
    return gulp.src(source + '/**/*.html')
        /*.pipe(plugins.extender({
            annotation: false,
            verbose: false
        }))*/
        .pipe(gulp.dest(dist));
});

gulp.task('img', function () {
    return gulp.src(source + '/assets/img/*.{png,jpg,jpeg,gif,svg}')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(dist + '/assets/img'));
});

gulp.task('build-js', function () {
    return gulp.src([soqurce + '/**/*.js', '!' + source + '/bower_components/**'])
        .pipe(gulp.dest(dist))
        .pipe(plugins.livereload());
});

gulp.task('minify-js', function () {
    return gulp.src([dist + '/**/*.js', '!' + dist + '/bower_components/**'])
        .pipe(plugins.uglify())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('dependencies', function () {
    return gulp.src(source + '/bower_components/**')
        .pipe(gulp.dest(dist+ '/bower_components'));
});

gulp.task('watch', function () {
    plugins.livereload.listen();
    gulp.watch(source + '/assets/sass/*.scss', ['build-css','minify']);
    gulp.watch('assets/js/*.js', ['build-js']);
});

gulp.task('cleanup', function () {
    return del([
        'dist/*'
    ]);
});

gulp.task('build', ['cleanup','dependencies','build-html','build-css','minify-css','build-js','minify-js','img']);

gulp.task('default', ['build']);