const React = require('react');
const textHyph = require('hypher');
const Scrollable = require('../scrollable');
const _ = require('lodash');
const cn = require('classnames');
const keycode = require('keycode');

document.addEventListener('copy', function(e) {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const div = document.createElement('div');
        const fragment = range.cloneContents();
        div.appendChild(fragment);
        e.clipboardData.setData(
            'text/plain',
            textHyph.unhyph(selection.toString())
        );
        e.clipboardData.setData(
            'text/html',
            textHyph.unhyph(div.innerHTML)
        );
    }
}, false);

module.exports = React.createClass({
    displayName: 'Main',
    getInitialState() {
        return {
            login: '',
            message: '',
            listMessage: [],
            loader: true
        };
    },
    handleChange: function(event) {
        let state = _.extend({}, this.state);
        state[event.target.name] = event.target.value;
        this.setState(state);
    },
    componentDidMount() {
        let self = this;
        this.props.ws.addMethods({
            loadNewMessage: function(message, login, result) {
                let err = null;
                let status = 'success';
                let state = _.extend({}, self.state);
                state.listMessage.push({
                    login: login,
                    message: message
                });
                self.setState(state);
                result(err, status);
            }
        });
        this.props.ws.call('loadMessages', function(err, result) {
            if (!err) {
                self.setState({
                    listMessage: JSON.parse(result),
                    loader: false
                });
            }
        });
    },
    sendMessage() {
        let self = this;
        const message = this.state.message;
        if (this.state.message.length > 0) {
            this.props.ws.call('sendMessage', message, function(err, status) {
                if (status == 'success') {
                    self.setState({message: ''});
                }
            });
        }
    },
    keyHandler(e) {
        switch (keycode(e)) {
            case 'enter': {
                this.sendMessage();
                break;
            }
            default: {
                break;
            }
        }
    },
    logout() {
        const self = this;
        this.props.ws.call('logout',
            'refreshMethods',
            function(err, status) {
            if (err === null && status == 'success') {
                self.props.changePage('login');
            }
        });
    },
    render() {
        let name = false;
        const messages = this.state.listMessage.map((elem, index) => {
            const show = name != elem.login;
            name = elem.login;
            return <div key={index} className="pad-item">
                <div className={cn('row', elem.isOwn && 'my-message')}>
                    <div className="message-login fix">
                        {(show)?elem.login:''}
                    </div>
                    <div className="fill message-text pad-mes">
                        {textHyph.hyph(elem.message)}
                    </div>
                </div>
            </div>;
        });
        return (<div
            className={cn('column fill', {loader: this.state.loader})}
            onKeyDown={this.keyHandler}
        >
            <div className="row fill center">
                <div className="block-outer-cont fix column">
                    <div className="row block-width fill">
                        <Scrollable children={messages} />
                    </div>
                </div>
            </div>
            <div className="row fix center block-send">
                <div className="block-outer fix column">
                    <div className="row pad-item end">
                        <div
                            onClick={this.logout}
                            className="column fill logout"
                        >Выйти</div>
                        <div className="column fix message">
                            <input
                                value={this.state.message}
                                name="message"
                                type="text"
                                tabIndex="1"
                                autoFocus={true}
                                placeholder="Сообщение"
                                onChange={this.handleChange}
                            />
                        </div>
                        <button
                            className="btn column fix end fix-btn-bot"
                            tabIndex="3"
                        >
                            <i
                                onClick={this.sendMessage}
                                className="fa fa-paper-plane"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>);
    }
});