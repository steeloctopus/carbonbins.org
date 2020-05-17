let gulp = require('gulp');
let gulpLoadPlugins = require('gulp-load-plugins');
let cleanCSS = require('gulp-clean-css');
let plugins = gulpLoadPlugins();
let path = require('path');
let browserSync = require('browser-sync').create();


// Compile and minify SASS/CSS
gulp.task('styles', (done) => {
    gulp.src('src/scss/core.scss')
        .pipe(plugins.sass({outputStyle: 'expanded'}).on('error', plugins.sass.logError))
        .pipe(plugins.rename(function(file) {
            file.dirname = file.dirname.replace(path.sep + 'sass', path.sep + 'css')
        }))
        .pipe(plugins.autoprefixer())
        .pipe(plugins.rename('core.css'))
        .pipe(gulp.dest('app/css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(plugins.concat('core.min.css'))
        .pipe(gulp.dest('app/css'));
    done();
});

// Compile and minify JS
gulp.task('js', (done) => {
    gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/uikit/dist/js/uikit-core.js',
        'node_modules/uikit/dist/js/uikit-icons.js',
        'src/js/core.js'
    ])
        .pipe(plugins.uglify({ mangle: false }))
        .pipe(plugins.concat('core.js'))
        .pipe(gulp.dest('app/js'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({extname: ".min.js"}))
        .pipe(gulp.dest('app/js'));
    done();
});

// Browser Sync
gulp.task('browser-sync', (done) => {
    browserSync.init({
        open: false,
        host: "localhost",
        proxy: "https://localhost:8080"
    });
    done();
});

// Watch for changes
gulp.task('watch', function(done) {
    gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('app/css/*.css').on('change', browserSync.reload);
    // gulp.watch('dist/img/svgs/*.svg', gulp.series('svgs')).on('change', browserSync.reload);
    gulp.watch(['**/*.php']).on('change', browserSync.reload);
    gulp.watch('src/js/*.js', gulp.series('js'));
    gulp.watch('app/js/*.js').on('change', browserSync.reload);
    done();
});


// Default task
gulp.task('default', gulp.series('styles','js','browser-sync', 'watch', function(done) { done(); }) );
// gulp.task('default', gulp.series('styles', 'js', 'watch', function(done) { done(); }) );
