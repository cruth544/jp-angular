var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'), babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    header = require('gulp-header'),
    watch = require('gulp-watch');
		livereload = require('gulp-livereload');

var jsFiles = {
    'index': [
        './www/js/controllers/home/home.js'
    ]
};

function compileJsFiles(sourceFiles, outputFilePath, outputFileName){
    console.log('Compiling Js File : ' + outputFileName + ' - ' + (new Date()).toLocaleTimeString());
    return gulp.src(sourceFiles)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat(outputFileName))
        .pipe(babel())
        .pipe(header(GLOBAL.banner))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outputFilePath))
        .on('error', function(err) {
            console.log(err);
            this.emit('end');
        })
				.pipe(livereload());
}

function compileAllJsFiles(){
    for(var fileName in jsFiles){
        compileJsFiles(jsFiles[fileName], './www/dist/js/', fileName + '.js');
    }
}

gulp.task('watch-js', function () {
    compileAllJsFiles();
    watch(['./www/**/*.js'], function() {
				livereload.listen();
        compileAllJsFiles();
    });
});
