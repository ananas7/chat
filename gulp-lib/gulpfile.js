const gulp = require('gulp');
const runSequence = require('run-sequence');
const gulpLib = require('./index');

gulp.task('develop', function(cb) {
    runSequence(
        'yarn-chat',
        'bower-i-chat',
        function() {
            gulpLib.shell('gulp', ['develop'], {cwd: '../chat'}, cb);
        }
    );
});

gulp.task('sumlib-test', function(cb) {
    runSequence(
        'yarn-sumlib',
        function() {
            gulpLib.shell('gulp', ['sumlib-test'], {cwd: '../sumlib'}, cb);
        }
    );
});

gulp.task('hypher-test', function(cb) {
    runSequence(
        'yarn-hypher',
        function() {
            gulpLib.shell('gulp', ['hypher-test'], {cwd: '../hypher'}, cb);
        }
    );
});

gulp.task('chat-test', function(cb) {
    runSequence(
        'yarn-chat',
        'bower-i-chat',
        function() {
            gulpLib.shell('gulp', ['chat-test'], {cwd: '../chat'}, cb);
        }
    );
});

gulp.task('gitlab-sumlib', function(cb) {
    runSequence(
        'yarn-sumlib',
        function() {
            gulpLib.shell('gulp', ['gitlab-sumlib'], {cwd: '../sumlib'}, cb);
        }
    );
});

gulp.task('gitlab-hypher', function(cb) {
    runSequence(
        'yarn-hypher',
        function() {
            gulpLib.shell('gulp', ['gitlab-hypher'], {cwd: '../hypher'}, cb);
        }
    );
});

gulp.task('gitlab-rpc-ws', function(cb) {
    runSequence(
        'yarn-rpc-ws',
        function() {
            gulpLib.shell('gulp', ['gitlab-rpc-ws'], {cwd: '../rpc-ws'}, cb);
        }
    );
});

gulp.task('gitlab-chat', function(cb) {
    runSequence(
        'yarn-chat',
        'bower-i-chat',
        function() {
            gulpLib.shell('gulp', ['gitlab-chat'], {cwd: '../chat'}, cb);
        }
    );
});

gulp.task('yarn-chat', function(cb) {
    gulpLib.packageInstall(
        'yarn',
        '../chat',
        'package.json',
        '../chat',
        cb
    );
});

gulp.task('bower-i-chat', function(cb) {
    gulpLib.packageInstall(
        'bower',
        '../chat',
        'bower.json',
        '../chat',
        cb
    );
});

gulp.task('yarn-sumlib', function(cb) {
    gulpLib.packageInstall(
        'yarn',
        '../sumlib',
        'package.json',
        '../sumlib',
        cb
    );
});

gulp.task('yarn-hypher', function(cb) {
    gulpLib.packageInstall(
        'yarn',
        '../hypher',
        'package.json',
        '../hypher',
        cb
    );
});

gulp.task('yarn-rpc-ws', function(cb) {
    gulpLib.packageInstall(
        'yarn',
        '../rpc-ws',
        'package.json',
        '../rpc-ws',
        cb
    );
});