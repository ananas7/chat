const path = require('path');
const pathsName = {
    test: '/test',
};
const paths = {
    deploySumlibBase: '/home/gitlab-runner/sumlib',
    mainBuildSumlib: path.join(__dirname, '/'),
    testPath: path.join(__dirname, pathsName.test)
};
module.exports = {
    paths: paths
};