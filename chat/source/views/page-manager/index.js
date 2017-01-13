const React = require('react');
const _ = require('lodash');
const Main = require('../main');
const Login = require('../login');
const Registration = require('../registration');
const getWsAbsoluteUrl = require('rpc-ws').getWsAbsoluteUrl;

module.exports = React.createClass({
    displayName: 'PageManager',
    getInitialState() {
        return {
            ws: new WebSocket(getWsAbsoluteUrl(window.location, '/')),
            page: 'login',
            login: false
        };
    },
    changePage(page, login) {
        const state = this.state;
        this.setState({
            page: page,
            login: (login) ? login : false
        });
    },
    componentDidMount() {
        this.state.ws.binaryType = 'arraybuffer';
        require('rpc-ws').client(this.state.ws);
    },
    render() {
        let Page = Login;
        if (this.state.page == 'chat' && this.state.login) {
            Page = Main;
        } else if (this.state.page == 'reg') {
            Page = Registration;
        }
        return <Page
            ws={this.state.ws}
            login={this.state.login}
            changePage={this.changePage}
        />;
    }
});