const path = require('path');
const pathsName = {
    test: '/test',
};
const paths = {
    deployHypherBase: '/home/gitlab-runner/hypher',
    mainBuildHypher: path.join(__dirname, '/'),
    testPath: path.join(__dirname, pathsName.test)
};
module.exports = {
    paths: paths
};