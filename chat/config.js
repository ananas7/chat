const path = require('path');
const pathsName = {
    chat: '/',
    source: '/source',
    htmls: '/source/htmls',
    htmlsDevelop: '/source/htmls/develop',
    views: '/source/views',
    bower: '/bower_components',
    openSans: '/bower_components/open-sans-fontface',
    fontAwesome: '/bower_components/font-awesome',
    target: '/target',
    styles: '/target/styles',
    fonts: '/target/fonts',
    fontsForUrl: '../fonts/',
    reactBuild: '/source/index.jsx',
    reactBundl: 'bundle.js',
    maps: '/target/maps/',
    serverMain: '/index.js',
    serverConfig: '/config.js',
    serverAuthorize: '/authorize.js',
    userHandlerDir: '/user-handler'
};
const paths = {
    chat: path.join(
        __dirname,
        pathsName.chat
    ),
    sourcePath: path.join(
        __dirname,
        pathsName.source
    ),
    viewsPath: path.join(
        __dirname,
        pathsName.views
    ),
    htmlsPath: path.join(
        __dirname,
        pathsName.htmls
    ),
    htmlsPathDevelop: path.join(
        __dirname,
        pathsName.htmlsDevelop
    ),
    openSansPath: path.join(
        __dirname,
        pathsName.openSans
    ),
    fontAwesomePath: path.join(
        __dirname,
        pathsName.fontAwesome
    ),
    targetPath: path.join(
        __dirname,
        pathsName.target
    ),
    stylesPath: path.join(
        __dirname,
        pathsName.styles
    ),
    fontsPath: path.join(
        __dirname,
        pathsName.fonts
    ),
    reactBuildPath: path.join(
        __dirname,
        pathsName.reactBuild
    ),
    reactBundlPath: path.join(
        __dirname,
        pathsName.target + '/' + pathsName.reactBundl
    ),
    mapsPath: path.join(
        __dirname,
        pathsName.maps
    ),
    serverMainPath: path.join(
        __dirname,
        pathsName.serverMain
    ),
    serverConfigPath: path.join(
        __dirname,
        pathsName.serverConfig
    ),
    userHandlerDir: path.join(
        __dirname,
        pathsName.userHandlerDir
    ),
    serverAuthorize: path.join(
        __dirname,
        pathsName.serverAuthorize
    ),
    deployBasePath: '/home/gitlab-runner/chat'
};
const dbAccess = {
    dbAdmin: 'admin_chat',
    dbPassword: 'Ohnge2ch',
    dbName: 'chat',
    dbHost: 'localhost',
    dbPort: 5432
};
module.exports = {
    pathsName: pathsName,
    paths: paths,
    dbAccess: dbAccess
};