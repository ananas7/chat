const gulp = require('gulp');
const runSequence = require('run-sequence');
const gulpLib = require('../gulp-lib/');
const paths = require('./config').paths;

// Deploy

gulp.task('gitlab-sumlib', function(cb) {
    runSequence(
        'lint',
        'check-style',
        'unlink-sumlib',
        'clean-app-sumlib',
        'create-sumlib',
        'deploy-sumlib',
        'yarn-sumlib',
        'yarn-link-sumlib',
        function() {
            /* jshint ignore:start */
            console.log('end all task');
            /* jshint ignore:end */
            cb();
        }
    );
});

gulp.task('sumlib-test', function() {
    runSequence(
        'test-sum'
    );
});

// Sumlib tasks

gulp.task('unlink-sumlib', function(cb) {
    gulpLib.shell('yarn', ['unlink'], {cwd: paths.deploySumlibBase}, cb);
});

gulp.task('clean-app-sumlib', function(cb) {
    const foldersDel = [
        paths.deploySumlibBase + '/index.js',
        paths.deploySumlibBase + '/package.json',
        paths.deploySumlibBase + '/node_modules/'
    ];
    return gulpLib.cleanApp(foldersDel, cb);
});

gulp.task('create-sumlib', function(cb) {
    gulpLib.createFolder(paths.deploySumlibBase, cb);
});

gulp.task('deploy-sumlib', function() {
    const targets = [
        [
            'server',
            paths.mainBuildSumlib + '/index.js',
            paths.deploySumlibBase
        ],
        [
            'package',
            paths.mainBuildSumlib + '/package.json',
            paths.deploySumlibBase
        ]
    ];
    return gulpLib.copyFiles(targets, 'prod copy: ');
});

gulp.task('yarn-sumlib', function(cb) {
    const src = paths.mainBuildSumlib;
    const dest = paths.deploySumlibBase;
    gulpLib.packageInstall('yarn', src, 'package.json', dest, cb);
});

gulp.task('yarn-link-sumlib', function(cb) {
    gulpLib.shell('yarn', ['link'], {cwd: paths.deploySumlibBase}, cb);
});

gulp.task('test-sum', function() {
    return gulpLib.test(paths.testPath + '/test-sum.js');
});

gulp.task('lint', function() {
    const files = [
        './*.js'
    ];
    gulpLib.lint(files, false);
});

gulp.task('check-style', () => {
    const files = [
        './*.js'
    ];
    gulpLib.jscsCheck(files, false);
});