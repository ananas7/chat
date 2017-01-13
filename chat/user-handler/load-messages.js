const Q = require('q');
const config = require('../config').dbAccess;
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

module.exports = function(result) {
    let err = null;
    Q.spawn(function*() {
        const queryMessages = yield knex('messages')
            .select('message', 'date', 'id_user');
        const queryUsers = yield knex('users').select('id', 'user');
        let users = [];
        let messages = [];
        for (let i = 0; i < queryUsers.length; ++i) {
            users[queryUsers[i].id] = queryUsers[i].user;
        }
        for (let i = 0; i < queryMessages.length; ++i) {
            messages.push({
                // jscs:disable
                login: users[queryMessages[i].id_user],
                // jscs:enable
                message: queryMessages[i].message
            });
        }
        result(err, JSON.stringify(messages));
    });
};