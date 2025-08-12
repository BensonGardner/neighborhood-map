// Require modules for minifying images and code

var gulp = require('gulp'), 
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    cleanCSS = require('gulp-clean-css'),
    git = require('gulp-git'),
    htmlmin = require('gulp-htmlmin');

gulp.task('minify', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('docs'));
});
 
gulp.task('minify-css', function() {
  return gulp.src('src/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('docs'));
});
 
// uglify - compress the js.
gulp.task('compress', function (cb) {
    pump([
        gulp.src('src/**/*.js'),
        uglify(),
        gulp.dest('docs')
    ],
    cb
  );
});
                                                        
// image processing
gulp.task('images', function() {
  var final = 'docs';
  return gulp.src('src/**/*')
    .pipe(imagemin({ optimizationLevel: 7 }))
    .pipe(gulp.dest(final));
});

gulp.task('commit', function() {
  return gulp.src('src/**')
    .pipe(git.add())
    .pipe(git.commit(''));
    git.push('', function (err) {
        if (err) throw err;
    });
});

gulp.task('all-but-commit', 
    ['minify-css', 'compress', 'minify', 'images']
);

gulp.task('default', 
    ['minify-css', 'compress', 'minify', 'images', 'commit']
);