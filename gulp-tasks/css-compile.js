var gulp = require("gulp"),
    plumber = require('gulp-plumber'),
    sass = require("gulp-sass"),
    header = require('gulp-header'),
    watch = require('gulp-watch'),
		autoprefixer = require('gulp-autoprefixer');
		livereload = require('gulp-livereload');

function compileCssFolder(baseFolder, file){
    console.log('Running css compile on : ' + baseFolder + ' - ' + (new Date()).toLocaleTimeString());

    gulp.src(baseFolder + '/**/*.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true
        }))
				.pipe(autoprefixer({
					browsers: ['last 10 versions']
				}))
        .pipe(header(GLOBAL.banner))
        .pipe(gulp.dest( './www/dist/css' ))
        .on('error', function(err) {
            console.log(err);
            this.emit('end');
        })
				.pipe(livereload());
}

function watchCssFolder(baseFolder){
    compileCssFolder(baseFolder);
		livereload.listen();
    watch([
        baseFolder + '/**/*.scss',
        './gulp-tasks/css-compile.js'
    ], function ( file ) {
        compileCssFolder(baseFolder);
    }).on('error', function (err) {
        console.log(err);
        this.emit('end');
    });

}

gulp.task('watch-scss', function () {
		livereload.listen();
    watchCssFolder('./www/js');
});
