const gulp = require('gulp');
const runSequence = require('run-sequence');
const gulpLib = require('../gulp-lib/');
const paths = require('./config').paths;

// Deploy

gulp.task('gitlab-hypher', function(cb) {
    runSequence(
        'lint',
        'check-style',
        'unlink-hypher',
        'clean-app-hypher',
        'create-hypher',
        'deploy-hypher',
        'yarn-hypher',
        'yarn-link-hypher',
        function() {
            /* jshint ignore:start */
            console.log('end all task');
            /* jshint ignore:end */
            cb();
        }
    );
});

gulp.task('hypher-test', function() {
    runSequence(
        'test-hypher'
    );
});

// Hypher tasks

gulp.task('unlink-hypher', function(cb) {
    gulpLib.shell('yarn', ['unlink'], {cwd: paths.deployHypherBase}, cb);
});

gulp.task('clean-app-hypher', function(cb) {
    const foldersDel = [
        paths.deployHypherBase + '/index.js',
        paths.deployHypherBase + '/package.json',
        paths.deployHypherBase + '/node_modules/'
    ];
    return gulpLib.cleanApp(foldersDel, cb);
});

gulp.task('create-hypher', function(cb) {
    gulpLib.createFolder(paths.deployHypherBase, cb);
});

gulp.task('deploy-hypher', function() {
    const targets = [
        [
            'server',
            paths.mainBuildHypher + '/index.js',
            paths.deployHypherBase
        ],
        [
            'package',
            paths.mainBuildHypher + '/package.json',
            paths.deployHypherBase
        ]
    ];
    return gulpLib.copyFiles(targets, 'prod copy: ');
});

gulp.task('yarn-hypher', function(cb) {
    const src = paths.mainBuildHypher;
    const dest = paths.deployHypherBase;
    gulpLib.packageInstall('yarn', src, 'package.json', dest, cb);
});

gulp.task('yarn-link-hypher', function(cb) {
    gulpLib.shell('yarn', ['link'], {cwd: paths.deployHypherBase}, cb);
});

gulp.task('test-hypher', function() {
    return gulpLib.test(paths.testPath + '/test-hypher.js');
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