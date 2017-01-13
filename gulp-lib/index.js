const gulp = require('gulp');
const _ = require('lodash');
const path = require('path');
const jsxhint = require('jshint-jsx').JSXHINT;
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins({
    pattern: ['*']
});

function copyFiles(targets, str, watching) {
    return targets.map(function(arr) {
        const desc = arr[0];
        const src = arr[1];
        const dest = arr[2];
        const transform = arr[3] || function(x) { return x; };
        watching && plugins.watch(src, bundle);
        return bundle();
        function bundle(evt) {
            if (evt) {
                plugins.util.log(
                    plugins.util.colors.blue(path.relative(__dirname, evt.path))
                );
            }
            return transform(
                gulp.src(src)
                    .pipe(plugins.flatten())
                    .on('error', plugins.util.log)
                    .pipe(plugins.duration(str + desc))
            )
                .pipe(gulp.dest(dest));
        }
    });
}

function shell(command, params, options, cb) {
    const spawn = require('child_process').spawn;
    const shell = spawn(command, params, options);
    shell.on('close', function(code) {
        cb(code === 0 ? null : command + ' error shell: ' + code);
    });
    shell.on('error', function(err) {
        /* jshint ignore:start */
        console.log('Error: ' + err);
        /* jshint ignore:end */
    });
    // Error
    shell.stderr.on('data', (data) => {
        /* jshint ignore:start */
        console.log(`stderr: ${data}`);
        /* jshint ignore:end */
    });
    // Success
    shell.stdout.on('data', (data) => {
        /* jshint ignore:start */
        console.log(`stdout: ${data}`);
        /* jshint ignore:end */
    });
}

function cleanApp(params, cb) {
    try {
        plugins.del(params, {force: true}).then(function(paths) {
            /* jshint ignore:start */
            console.log('Deleted files and folders:\n', paths.join('\n'));
            /* jshint ignore:end */
            cb();
        });
    } catch (e) {
        /* jshint ignore:start */
        console.log(e.getMessage());
        /* jshint ignore:end */
    }
}

function packageInstall(service, src, packageName, dest, cb) {
    const target = [
        [
            'temp',
            src + '/' + packageName,
            dest
        ]
    ];
    gulp.task('copy-package', function() {
        copyFiles(target, 'copy package: ', false);
    });

    gulp.task('install-package', function(cb) {
        shell(
            service,
            [((service == 'bower' ? 'install' : ''))],
            {cwd: dest},
            cb
        );
    });

    plugins.runSequence(
        'copy-package',
        'install-package',
        function() {
            cb();
        }
    );
}

function createFolder(folder, cb) {
    plugins.mkdirp(folder, function(err) {
        if (err) {
            /* jshint ignore:start */
            console.error(err);
            /* jshint ignore:end */
        } else {
            /* jshint ignore:start */
            console.log('mkdir ' + folder);
            /* jshint ignore:end */
        }
        cb();
    });
}

function lint(files, watching) {
    watching && plugins.watch(files, bundle);
    return bundle();
    function bundle() {
        const jshintConfig = require('../gulp-lib/jshint.json');
        jshintConfig.lookup = false;
        jshintConfig.linter = jsxhint;
        return gulp.src(files)
            .on('error', plugins.util.log)
            .pipe(plugins.jshint(jshintConfig))
            .pipe(plugins.jshint.reporter('jshint-stylish'))
            .pipe(plugins.jshint.reporter((watching)?'':'fail'));
    }
}

function jscsCheck(files, watching) {
    watching && plugins.watch(files, bundle);
    return bundle();
    function bundle() {
        return gulp.src(files)
            .on('error', plugins.util.log)
            .pipe(plugins.jscs({configPath: '../gulp-lib/jscs.json'}))
            .pipe(plugins.jscs.reporter())
            .pipe(plugins.jscs.reporter((watching)?'':'fail'));
    }
}

function test(file) {
    return gulp.src([file], {read: false})
        .pipe(plugins.mocha({
            reporter: 'spec'
        }))
        .on('error', plugins.util.log)
        .once('error', function() {
            process.exit(1);
        })
        .once('end', function() {
            process.exit();
        });
}

module.exports = {
    copyFiles: copyFiles,
    shell: shell,
    cleanApp: cleanApp,
    packageInstall: packageInstall,
    createFolder: createFolder,
    lint: lint,
    jscsCheck: jscsCheck,
    test: test
};