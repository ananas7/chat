const fs = require('fs');
const gulp = require('gulp');
const _ = require('lodash');
const path = require('path');
const gulpLib = require('../gulp-lib/');
const pathsName = require('./config').pathsName;
const paths = require('./config').paths;
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins({
    pattern: ['gulp-*', 'gulp.*', '*ify',
        'vinyl-source-stream', 'vinyl-buffer',
        'prettysize', 'nodemon', 'run-sequence'],
    rename: {
        'vinyl-source-stream': 'source',
        'vinyl-buffer': 'buffer',
        'prettysize': 'pretty',
        'gulp-autoprefixer': 'prefixer'
    }
});
// Define develop task

gulp.task('develop', function(cb) {
    plugins.runSequence(
        'yarn-link-sumlib-develop',
        'yarn-link-hypher-develop',
        'yarn-link-rpc-ws-develop',
        'create-user-handler-methods',
        'create-target',
        'watch-all'
    );
});

// Task for test chat

gulp.task('chat-test', function(cb) {
    plugins.runSequence(
        'lint',
        'check-style',
        function() {
            /* jshint ignore:start */
            console.log('end all tasks');
            /* jshint ignore:end */
            cb();
        }
    );
});

// Deploy

gulp.task('gitlab-chat', function(cb) {
    plugins.runSequence(
        'create-target',
        'static-files',
        'build-css',
        'concat-css',
        'yarn-link-sumlib',
        'yarn-link-hypher',
        'yarn-link-rpc-ws',
        'build-react',
        'clean-app',
        'create-target-deploy',
        'create-user-handler-deploy',
        'create-user-handler-methods',
        'deploy',
        'yarn-link-sumlib-prod',
        'yarn-link-hypher-prod',
        'yarn-link-rpc-ws-prod',
        'yarn',
        'restart-server',
        function() {
            /* jshint ignore:start */
            console.log('end all tasks');
            /* jshint ignore:end */
            cb();
        }
    );
});

// Work with local server

gulp.task('static-files', function() {
    const copies = [
        [
            'index.html',
            paths.htmlsPath + '/*.html',
            paths.targetPath
        ],

        [
            'open sans font',
            paths.openSansPath + '/fonts/**/*.*',
            paths.fontsPath
        ],
        [
            'open sans css',
            paths.openSansPath + '/*.css',
            paths.stylesPath,
            function(x) {
                return x
                    .pipe(
                        plugins.replace(
                            /url\("\.\/fonts\/[^\/]*\//g,
                            'url("' + pathsName.fontsForUrl
                        )
                    )
                    .pipe(
                        plugins.replace(
                            '\n/*# sourceMappingURL=open-sans.css.map */\n',
                            ''
                        )
                    );
            }
        ],

        [
            'font awesome font',
            paths.fontAwesomePath + '/fonts/*.*',
            paths.fontsPath
        ],
        [
            'font awesome css',
            paths.fontAwesomePath + '/css/font-awesome.min.css',
            paths.stylesPath
        ]
    ];
    return gulpLib.copyFiles(copies, 'build copy: ');
});

gulp.task('build-css', function() {
    return watchCss(false);
});

gulp.task('build-react', function() {
    return clientCode(false);
});

gulp.task('clean-app', function(cb) {
    const foldersDel = [
        paths.deployBasePath + pathsName.serverMain,
        paths.deployBasePath + pathsName.serverConfig,
        paths.deployBasePath + pathsName.serverAuthorize,
        paths.deployBasePath + pathsName.userHandlerDir,
        paths.deployBasePath + '/package.json',
        paths.deployBasePath + pathsName.target,
        paths.deployBasePath + '/node_modules/',
        paths.deployBasePath + '/lib/'
    ];
    gulpLib.cleanApp(foldersDel, cb);
});

gulp.task('concat-css', function() {
    return gulp.src(paths.stylesPath + '/*.css')
        .pipe(plugins.concat('main.css'))
        .on('error', plugins.util.log)
        .pipe(gulp.dest(paths.stylesPath));
});

gulp.task('deploy', function() {
    const targets = [
        [
            'server',
            paths.serverMainPath,
            paths.deployBasePath
        ],
        [
            'server-config',
            paths.serverConfigPath,
            paths.deployBasePath
        ],
        [
            'server-authorize',
            paths.serverAuthorize,
            paths.deployBasePath
        ],
        [
            'package',
            path.join(__dirname, '/package.json'),
            paths.deployBasePath
        ],
        [
            'html',
            paths.targetPath + '/*.html',
            paths.deployBasePath + pathsName.target
        ],
        [
            'bundle',
            paths.reactBundlPath,
            paths.deployBasePath + pathsName.target
        ],
        [
            'maps',
            paths.mapsPath + '/*.map',
            paths.deployBasePath + pathsName.maps
        ],
        [
            'styles',
            paths.stylesPath + '/main.css',
            paths.deployBasePath + pathsName.styles
        ],
        [
            'fonts',
            paths.fontsPath + '/*.*',
            paths.deployBasePath + pathsName.fonts
        ],
        [
            'user-handler',
            paths.userHandlerDir + '/*.*',
            paths.deployBasePath + pathsName.userHandlerDir
        ]
    ];
    return gulpLib.copyFiles(targets, 'prod copy: ');
});

gulp.task('yarn', function(cb) {
    const src = './';
    const dest = paths.deployBasePath;
    gulpLib.packageInstall('yarn', src, 'package.json', dest, cb);
});

gulp.task('restart-server', function(cb) {
    gulpLib.shell('service', ['chat', 'restart'], {}, cb);
});

gulp.task('yarn-link-sumlib-develop', function(cb) {
    plugins.runSequence(
        'yarn-unlink-sumlib',
        'yarn-link-sumlib-remote',
        'yarn-link-sumlib',
        function() {
            /* jshint ignore:start */
            console.log('end sumlib link');
            /* jshint ignore:end */
            cb();
        }
    );
});

gulp.task('yarn-link-hypher-develop', function(cb) {
    plugins.runSequence(
        'yarn-unlink-hypher',
        'yarn-link-hypher-remote',
        'yarn-link-hypher',
        function() {
            /* jshint ignore:start */
            console.log('end hypher link');
            /* jshint ignore:end */
            cb();
        }
    );
});

gulp.task('yarn-link-rpc-ws-develop', function(cb) {
    plugins.runSequence(
        'yarn-unlink-rpc-ws',
        'yarn-link-rpc-ws-remote',
        'yarn-link-rpc-ws',
        function() {
            /* jshint ignore:start */
            console.log('end rpc-ws link');
            /* jshint ignore:end */
            cb();
        }
    );
});

gulp.task('yarn-unlink-sumlib', function(cb) {
    yarnUnlink('../sumlib', cb);
});

gulp.task('yarn-link-sumlib-remote', function(cb) {
    yarnLinkRemote('../sumlib', cb);
});

gulp.task('yarn-unlink-hypher', function(cb) {
    yarnUnlink('../hypher', cb);
});

gulp.task('yarn-link-hypher-remote', function(cb) {
    yarnLinkRemote('../hypher', cb);
});

gulp.task('yarn-unlink-rpc-ws', function(cb) {
    yarnUnlink('../rpc-ws', cb);
});

gulp.task('yarn-link-rpc-ws-remote', function(cb) {
    yarnLinkRemote('../rpc-ws', cb);
});

gulp.task('yarn-link-sumlib-prod', function(cb) {
    yarnLink('sumlib', {cwd: paths.deployBasePath}, cb);
});

gulp.task('yarn-link-hypher-prod', function(cb) {
    yarnLink('hypher', {cwd: paths.deployBasePath},  cb);
});

gulp.task('yarn-link-rpc-ws-prod', function(cb) {
    yarnLink('rpc-ws', {cwd: paths.deployBasePath},  cb);
});

gulp.task('yarn-link-sumlib', function(cb) {
    yarnLink('sumlib', {}, cb);
});

gulp.task('yarn-link-hypher', function(cb) {
    yarnLink('hypher', {}, cb);
});

gulp.task('yarn-link-rpc-ws', function(cb) {
    yarnLink('rpc-ws', {}, cb);
});

gulp.task('client-static', function() {
    return clientStatic(true);
});

gulp.task('lint', function() {
    const files = [
        paths.chat + '/*.js',
        paths.userHandlerDir + '/*.js',
        paths.viewsPath + '/**/*.js',
        paths.reactBuildPath
    ];
    gulpLib.lint(files, false);
});

gulp.task('check-style', () => {
    const files = [
        paths.chat + '/*.js',
        paths.userHandlerDir + '/*.js',
        paths.viewsPath + '/**/*.js',
        paths.reactBuildPath
    ];
    gulpLib.jscsCheck(files, false);
});

gulp.task('watch-all', function(cb) {
    const filesJscs = [
        paths.chat + '/*.js',
        paths.userHandlerDir + '/*.js',
        paths.viewsPath + '/**/*.js',
        paths.reactBuildPath,
        '../sumlib/*.js',
        '../hypher/*.js',
        '../gulp-lib/*.js',
        '../rpc-ws/*.js'
    ];
    const filesLint = [
        paths.chat + '/*.js',
        paths.userHandlerDir + '/*.js',
        paths.viewsPath + '/**/*.js',
        paths.reactBuildPath,
        '../sumlib/*.js',
        '../hypher/*.js',
        '../gulp-lib/*.js',
        '../rpc-ws/*.js'
    ];
    watchStyleSyntax(filesJscs, filesLint);
    clientStatic(true);
    clientCode(true);
    watchCss(true);
    startServer();
});

gulp.task('test', function() {});

gulp.task('create-target', function(cb) {
    gulpLib.createFolder(paths.targetPath, cb);
});

gulp.task('create-target-deploy', function(cb) {
    gulpLib.createFolder(paths.deployBasePath + pathsName.target, cb);
});

gulp.task('create-user-handler-deploy', function(cb) {
    gulpLib.createFolder(paths.deployBasePath + pathsName.userHandlerDir, cb);
});

gulp.task('yarn-develop', function(cb) {
    const src = './';
    const dest = './';
    gulpLib.packageInstall('yarn', src, 'package.json', dest, cb);
});

gulp.task('create-user-handler-methods', function(cb) {
    userHandlerCreate(paths.userHandlerDir, cb);
});

function startServer() {
    plugins.nodemon({
        script: paths.serverMainPath,
        watch: paths.serverMainPath
    }).on('start', function() {
        /* jshint ignore:start */
        console.log('started!');
        /* jshint ignore:end */
    }).on('restart', function() {
        /* jshint ignore:start */
        console.log('restarted!');
        /* jshint ignore:end */
    });
}

function watchStyleSyntax(filesJscs, filesLint) {
    gulpLib.jscsCheck(filesJscs, true);
    gulpLib.lint(filesLint, true);
}

function yarnLink(module, options, cb) {
    gulpLib.shell('yarn', ['link', module], options, cb);
}

function yarnLinkRemote(path, cb) {
    gulpLib.shell('yarn', ['link'], {cwd: path}, cb);
}

function yarnUnlink(path, cb) {
    gulpLib.shell('yarn', ['unlink'], {cwd: path}, cb);
}

function clientStatic(watching) {
    const copies = [
        [
            'develop.html',
            paths.htmlsPathDevelop + '/*.html',
            paths.targetPath
        ],

        [
            'open sans font',
            paths.openSansPath + '/fonts/**/*.*',
            paths.fontsPath
        ],
        [
            'open sans css',
            paths.openSansPath + '/*.css',
            paths.stylesPath,
            function(x) {
                return x
                    .pipe(
                        plugins.replace(
                            /url\("\.\/fonts\/[^\/]*\//g,
                            'url("' + pathsName.fontsForUrl
                        )
                    )
                    .pipe(
                        plugins.replace(
                            '\n/*# sourceMappingURL=open-sans.css.map */\n',
                            ''
                        )
                    );
            }
        ],

        [
            'font awesome font',
            paths.fontAwesomePath + '/fonts/*.*',
            paths.fontsPath
        ],
        [
            'font awesome css',
            paths.fontAwesomePath + '/css/font-awesome.min.css',
            paths.stylesPath
        ],
        [
            'images',
            './source/images/!**/!*.png',
            '/images'
        ],
    ];
    return gulpLib.copyFiles(copies, 'client-static: ', watching);
}

function clientCode(watching) {
    const config = _.extend({}, plugins.watchify.args, {
        debug: true
    });

    let b;
    if (watching) {
        const wConfig = {
            verbose: true
        };
        b = plugins.watchify(plugins.browserify(config), wConfig);
    } else {
        b = plugins.browserify(config);
    }

    b = b.add(paths.reactBuildPath)
        .transform(plugins.babelify, {
            global: true,
            presets: ['es2015', 'react'],
        });

    if (watching) {
        b.on('log', function(message) {
            const match = message.match(/^(\d+) bytes written \((.*)\)$/);
            if (match) {
                message = plugins.pretty(parseInt(match[1], 10)) +
                    ' in ' + match[2];
            }
            plugins.util.log(message);
        });
        b.on('update', bundle);
    }

    return bundle();

    function bundle(files) {
        if (files) {
            files.forEach(function(file) {
                plugins.util.log(plugins.util.colors.blue(
                    path.relative(__dirname, file))
                );
            });
        } else {
            plugins.util.log('client-watch first run');
        }
        return b.bundle()
            .on('error', function(error) {
                plugins.util.log(
                    error.toString().replace('Error: ', '')
                );
            })
            .pipe(plugins.source('bundle.js'))
            .pipe(plugins.buffer())
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.sourcemaps.write('./maps/', {
                sourceRoot: '/maps/'
            }))
            .pipe(gulp.dest('target'));
    }
}

function watchCss(watching) {
    watching && plugins.watch(paths.sourcePath + '/**/*.scss', bundle);
    return bundle();
    function bundle(evt) {
        evt && plugins.util.log(plugins.util.colors.blue(
            path.relative(__dirname, evt.path)
        ));
        return gulp.src(paths.sourcePath + '/index.scss')
            .on('error', plugins.util.log)
            .pipe(plugins.duration('scss: '))
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.sass().on('error', plugins.sass.logError))
            .pipe(plugins.prefixer({
                flexbox: false
            }))
            .pipe(plugins.cleanCss())
            .pipe(plugins.sourcemaps.write('../maps/', {
                sourceRoot: '/maps/source/'
            }))
            .pipe(gulp.dest(paths.stylesPath));
    }
}

function userHandlerCreate(dir, cb) {
    const fileName = 'user-handler-methods.js';
    let UserHandlerMethods = 'module.exports = {\n';
    const files = fs.readdirSync(dir);
    for (let i in files) {
        if (files[i] != 'index.js' && files[i] != fileName) {
            const name = files[i].split('-');
            const methodName = name[0] + name[1].slice(0, 1).toUpperCase() +
                name[1].slice(1);
            UserHandlerMethods += '    ' + methodName.split('.')[0] +
                ": require('./" + files[i] + "'),\n";
        }
    }
    UserHandlerMethods += '};';
    fs.writeFileSync(dir + '/' + fileName, UserHandlerMethods);
    /* jshint ignore:start */
    console.log('remake UserHandlerMethods');
    /* jshint ignore:end */
    cb();
}