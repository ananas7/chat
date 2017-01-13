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
const loadNewMessage = require('rpc-ws').loadNewMessage;

module.exports = function(message, result) {
    let err = null;
    let status;
    let session = {
        user: this.user,
        id: this.id
    };
    Q.spawn(function*() {
        const query = yield knex('messages').insert({
            // jscs:disable
            id_user: session.id,
            // jscs:enable
            message: message,
            date: getDateTime()
        });
        loadNewMessage(message, session.user);
        status = 'success';
        result(err, status);
    });
};

function getDateTime() {
    let date = new Date();
    let hour = date.getHours();
    hour = (hour < 10 ? '0' : '') + hour;
    let min  = date.getMinutes();
    min = (min < 10 ? '0' : '') + min;
    let sec  = date.getSeconds();
    sec = (sec < 10 ? '0' : '') + sec;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = (month < 10 ? '0' : '') + month;
    let day  = date.getDate();
    day = (day < 10 ? '0' : '') + day;
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}