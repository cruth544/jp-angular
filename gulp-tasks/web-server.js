var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('web-server', function() {
    connect.server({
        root : './www',
        port : 8888,
				livereload: true
    });
});

