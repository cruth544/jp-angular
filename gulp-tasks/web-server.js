var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('web-server', function() {
    connect.server({
        root : './www',
        port : 9090,
				livereload: true
    });
});

