const _ = require('lodash');
const logout = function(result) {
    let err = null;
    let status = 'success';
    result(err, status);
};
const methods = _.extend(require('./user-handler-methods'), {logout: logout});

class UserHandler {
    constructor(session) {
        this.session = session;
    }
}
_.extend(UserHandler.prototype, methods);

module.exports = UserHandler;