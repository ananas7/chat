const path = require('path');
const pathsName = {
    test: '/test',
};
const paths = {
    deployRpcWsBase: '/home/gitlab-runner/rpc-ws',
    mainBuildRpcWs: path.join(__dirname, '/'),
    testPath: path.join(__dirname, pathsName.test)
};
module.exports = {
    paths: paths
};