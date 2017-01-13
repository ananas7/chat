const _ = require('lodash');
const Buffer = require('buffer').Buffer;
const UserCredit = require('./user-credit');
let wsServer;
const refreshMethod = 'refreshMethods';
let login;
let registration;
const methodForMinusCredit = {
    'login': true,
    'registration': false
};

function Rpc(ws) {
    this.methodsRpc = {};
    this.session = {test: 'test'};
    let currId = 0;
    let callbacks = {};
    let delay = false;
    let k = 0;
    let credit = new UserCredit();

    const dispatch = (event) => {
        // TODO create normal buffer handler
        if (Buffer.isBuffer(event.data)) {
            afterParseBinary(JSON.parse(event.data.toString()));
        } else if (event.data instanceof ArrayBuffer) {
            const dataView = new DataView(event.data);
            const decoder = new TextDecoder();
            const decodedString = decoder.decode(dataView);
            afterParseBinary(JSON.parse(decodedString));
        } else {
            waitForConnection(
                () => ws.send('Error: data is not Buffer or Blob format'),
                500
            );
        }
    };
    ws.addEventListener('message', dispatch);

    const afterParseBinary = (data) => {
        if (data.type == 'response') {
            dispatchResponse(data);
        } else if (data.type == 'request') {
            dispatchRequest(data);
        }
    };

    const dispatchResponse = (obj) => {
        callbacks[obj.id](obj.err, obj.result);
        delete callbacks[obj.id];
    };

    const updateMethods = (methods, method) => {
        let mMethods = {};
        let dMethods = [];
        if (method != 'logout') {
            for (let k in methods) {
                if (!methods.hasOwnProperty(k)) {
                    mMethods[k] = methods[k].bind(methods.session);
                }
            }
            dMethods = ['login', 'registration'];
            login = this.methodsRpc.login;
            registration = this.methodsRpc.registration;
        } else {
            mMethods = {
                login: login,
                registration: registration
            };
            _.each(this.methodsRpc, (val, key) => {
                dMethods.push(key);
            });
        }
        this.deleteMethods(dMethods);
        this.extendMethods(mMethods);
    };

    const dispatchRequest = (obj) => {
        const responder = (err, result, methods) => {
            obj.refreshMethods &&
            result == 'success' &&
            updateMethods(methods, obj.method);
            const respJson = JSON.stringify({
                type: 'response',
                id: obj.id,
                err: err,
                result: result
            });
            waitForConnection(
                () => ws.send(Buffer.from(respJson), {binary: true}),
                500
            );
        };
        const params = obj.params.concat(responder);
        if (this.methodsRpc[obj.method] &&
            this.methodsRpc[obj.method].length == params.length) {
            this.methodsRpc[obj.method].apply(ws, params);
        } else {
            /* jshint ignore:start */
            console.log('Error: method '
                + obj.method
                + ' is not define or arguments length is wrong.');
            /* jshint ignore:end */
        }
    };

    const delaySendWs = (method, id, callback) => {
        if (method == 'login' || method == 'registration') {
            if (!delay) {
                delay = true;
                callback();
            } else {
                dispatchResponse({
                    err: {
                        text: 'Error: many query',
                        code: 429
                    },
                    result: 'fail',
                    id: id
                });
            }
        } else {
            callback();
        }
    };

    const checkUserCredit = (id, callback) => {
        if (credit.access()) {
            callback();
        } else {
            dispatchResponse({
                err: {
                    text: 'Error: lost user credit',
                    code: 509
                },
                result: 'fail',
                id: id
            });
        }
    };

    ws.call = function(method) {
        methodForMinusCredit[method] && credit.minus();
        let id = currId++;
        let params = Array.prototype.slice.call(arguments);
        params.shift();
        let refreshBool = false;
        if (params[0] == refreshMethod) {
            refreshBool = true;
            params.shift();
        }
        callbacks[id] = params.pop();
        const reqJson = JSON.stringify({
            type: 'request',
            method: method,
            id: id,
            params: params,
            refreshMethods: refreshBool
        });
        checkUserCredit(id, () => {
            delaySendWs(method, id, () => {
                waitForConnection(() => ws.send(
                    Buffer.from(reqJson),
                    {binary: true}
                ), 500);
            });
        });
    };

    ws.delay = () => {
        setTimeout(() => {
            delay = false;
        }, 2000);
    };

    ws.addMethods = (methods) => {
        let mmethods = {};
        for (let k in methods) {
            mmethods[k] = methods[k].bind();
        }
        this.extendMethods(mmethods);
    };

    function waitForConnection(callback, interval) {
        if (ws.readyState === 1) {
            callback();
        } else {
            // Optional: implement backoff for interval here
            setTimeout(function() {
                waitForConnection(callback, interval);
            }, interval);
        }
    }
}
Rpc.prototype.extendMethods = function(methods) {
    _.extend(this.methodsRpc, methods);
};
Rpc.prototype.deleteMethods = function(methods) {
    methods.map((e) => {
        delete this.methodsRpc[e];
    });
};

const serverMakeRpc = function(wss, methods) {
    wss.on('connection', function(ws) {
        let serverRpc = new Rpc(ws);
        serverRpc.extendMethods(methods);
    });
};
let makeRpc = {
    client: function(ws, methods) {
        let clientRpc = new Rpc(ws);
        clientRpc.extendMethods(methods);
    },
    makeRpcWithContext: function(methods, wss) {
        wsServer = wss;
        const context = {};
        for (let k in methods) {
            methods[k].bind(context);
        }
        serverMakeRpc(wsServer, methods);
    },
    loadNewMessage: function(message, login) {
        wsServer.clients.forEach(function(client) {
            client.call(
                'loadNewMessage',
                message,
                login,
                function(err, status) {
                    /* jshint ignore:start */
                    console.log(status);
                    /* jshint ignore:end */
                }
            );
        });
    },
    getWsAbsoluteUrl: function(loc, relative) {
        const proto = loc.protocol === 'https:' ? 'wss://' : 'ws://';
        const port = loc.port || (loc.protocol === 'https:' ? 443 : 80);
        return proto + loc.hostname + ':' + port + relative;
    }
};
module.exports = makeRpc;