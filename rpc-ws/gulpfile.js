const gulp = require('gulp');
const runSequence = require('run-sequence');
const path = require('path');
const gulpLib = require('../gulp-lib/');
const pathsName = {
    test: '/test',
};
const paths = {
    deployRpcWsBase: '/home/gitlab-runner/rpc-ws',
    mainBuildRpcWs: path.join(__dirname, '/'),
    testPath: path.join(__dirname, pathsName.test)
};

// Deploy

gulp.task('gitlab-rpc-ws', function(cb) {
    runSequence(
        'lint',
        'check-style',
        'unlink-rpc-ws',
        'clean-app-rpc-ws',
        'create-rpc-ws',
        'deploy-rpc-ws',
        'yarn-rpc-ws',
        'yarn-link-rpc-ws',
        function() {
            /* jshint ignore:start */
            console.log('end all task');
            /* jshint ignore:end */
            cb();
        }
    );
});

gulp.task('rpc-ws-test', function() {
    runSequence(
        'test-sum'
    );
});

// Rpc-ws tasks

gulp.task('unlink-rpc-ws', function(cb) {
    gulpLib.shell('yarn', ['unlink'], {cwd: paths.deployRpcWsBase}, cb);
});

gulp.task('clean-app-rpc-ws', function(cb) {
    const foldersDel = [
        paths.deployRpcWsBase + '/index.js',
        paths.deployRpcWsBase + '/package.json',
        paths.deployRpcWsBase + '/node_modules/'
    ];
    return gulpLib.cleanApp(foldersDel, cb);
});

gulp.task('create-rpc-ws', function(cb) {
    gulpLib.createFolder(paths.deployRpcWsBase, cb);
});

gulp.task('deploy-rpc-ws', function() {
    const targets = [
        [
            'server',
            paths.mainBuildRpcWs + '/index.js',
            paths.deployRpcWsBase
        ],
        [
            'user-credit',
            paths.mainBuildRpcWs + '/user-credit.js',
            paths.deployRpcWsBase
        ],
        [
            'package',
            paths.mainBuildRpcWs + '/package.json',
            paths.deployRpcWsBase
        ]
    ];
    return gulpLib.copyFiles(targets, 'prod copy: ');
});

gulp.task('yarn-rpc-ws', function(cb) {
    const src = paths.mainBuildRpcWs;
    const dest = paths.deployRpcWsBase;
    gulpLib.packageInstall('yarn', src, 'package.json', dest, cb);
});

gulp.task('yarn-link-rpc-ws', function(cb) {
    gulpLib.shell('yarn', ['link'], {cwd: paths.deployRpcWsBase}, cb);
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