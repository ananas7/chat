const express = require('express');
const app = express();
const path = require('path');
const sumlib = require('sumlib');
const server = require('http').createServer(app);
const url = require('url');
const port = 3030;
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
    server: server
});
const authorize = require('./authorize');
const makeRpcWithContext = require('rpc-ws').makeRpcWithContext;
const rpc = makeRpcWithContext({
    login: authorize.login,
    registration: authorize.registration
}, wss);

/* jshint ignore:start */
console.log('test sumlib 1 + 2 = ' + sumlib(1, 2));
/* jshint ignore:end */

app.use('/', express.static(path.join(__dirname, 'target')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/target/index.html'));
});

server.listen(port, function() {
    /* jshint ignore:start */
    console.log('Listening on ' + server.address().port);
    /* jshint ignore:end */
});