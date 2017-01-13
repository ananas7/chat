const Q = require('q');
let errorServer = {
    db: null
};
const config = require('./config').dbAccess;
const knex = require('knex')({
    client: 'pg',
    connection: {
        user: config.dbAdmin,
        database: config.dbName,
        port: config.dbPort,
        host: config.dbHost,
        password: config.dbPassword
    },
    debug: true,
    pool: {
        min: 0,
        max: 10
    }
});
const UserHandler = require('./user-handler');
let authorize = {};

authorize.registration = function(user, password, result) {
    let err = null;
    let status = 'success';
    let userHandler;
    Q.spawn(function*() {
        const query = yield knex('users').where({
            user: user,
            password: password
        }).catch (function(e) {
            /* jshint ignore:start */
            console.log(e);
            /* jshint ignore:end */
            if (e.routine) {
                errorServer.db = {
                    error: e.routine,
                    code: e.code
                };
            } else {
                errorServer.db = {
                    error: 'Error: lost connect',
                    code: 500
                };
            }
            return false;
        });
        if (query[0]) {
            status = false;
            if (errorServer.db) {
                err = errorServer.db;
                errorServer.db = null;
            } else {
                err = {
                    error: 'Error: not uniq name',
                    code: 403
                };
            }
        } else {
            const id = yield knex('users').insert({
                user: user,
                password: password,
                hash: 'cat'
            })
                .returning('id');
            status = 'success';
            let session = {
                user: user,
                id: id[0]
            };
            userHandler = new UserHandler(session);
        }
        result(err, status, userHandler);
    });
};
authorize.login = function(user, password, result) {
    let err = null;
    let status;
    let userHandler = {};
    if (user.length > 25) {
        err.user = {
            error: 'Long user',
            code: '1000'
        };
        status = false;
    }
    if (password.length > 100) {
        err.password = {
            error: 'Long password',
            code: '1001'
        };
        status = false;
    }
    Q.spawn(function*() {
        const query = yield knex('users').where({
            user: user,
            password: password
        }).catch (function(e) {
            /* jshint ignore:start */
            console.log(e);
            /* jshint ignore:end */
            if (e.routine) {
                errorServer.db = {
                    error: e.routine,
                    code: e.code
                };
            } else {
                errorServer.db = {
                    error: 'Error: lost connect',
                    code: 500
                };
            }
            return false;
        });
        if (query[0]) {
            status = 'success';
            let session = {
                user: query[0].user,
                id: query[0].id
            };
            userHandler = new UserHandler(session);
            // updateMenthodServerRpc(userHandler);
        } else {
            status = false;
            if (errorServer.db) {
                err = errorServer.db;
                errorServer.db = null;
            } else {
                err = {
                    error: 'Error: not found',
                    code: 404
                };
            }
        }
        result(err, status, userHandler);
    });
};

module.exports = authorize;