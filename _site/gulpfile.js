var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');


var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};


gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});


gulp.task('sass', function () {
    return gulp.src('_scss/styles.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            sourceComments: 'map',
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('css'));
});

gulp.task('compress', function() {
  gulp.src('_js/*.js')
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('js'))
});

gulp.task('watch', function () {
    gulp.watch(['_scss/*.scss', '_scss/components/*.scss'], ['sass', 'jekyll-rebuild']);
    gulp.watch('_js/*.js', ['compress', 'jekyll-rebuild']);
    gulp.watch(['index.html', '_layouts/*', '_includes/*', '_posts/**/*', '*.md', '*.html', '_config.yml', 'contactform.php'], ['jekyll-rebuild']);
});

gulp.task('default', ['browser-sync', 'watch']);
