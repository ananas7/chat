const React = require('react');
const _ = require('lodash');
const cn = require('classnames');

module.exports = React.createClass({
    displayName: 'Login',
    getInitialState() {
        return {
            username: '',
            password: '',
            errorAuth: false,
            errorText: 'Введена неправильная пара логин/пароль.',
            loader: false
        };
    },
    handleChange: function(event) {
        let state = _.extend({}, this.state);
        switch (event.target.name) {
            case 'username': {
                state.username = event.target.value;
                break;
            }
            case 'password': {
                state.password = event.target.value;
                break;
            }
            default: {
                break;
            }
        }
        this.setState(state);
    },
    checkLogin() {
        this.setState({loader: true});
        let self = this;
        this.props.ws.call(
            'login',
            'refreshMethods',
            this.state.username,
            this.state.password,
            function(err, status) {
                if (status == 'success') {
                    self.props.changePage('chat', self.state.username);
                } else {
                    let errorText;
                    switch (err.code) {
                        case 500: {
                            errorText = 'Ошибка подключения к БД. ' +
                                'Попробуйте снова через несколько минут.';
                            break;
                        }
                        case 404: {
                            errorText = 'Введена неправильная пара ' +
                                'логин/пароль.';
                            break;
                        }
                        case 429: {
                            errorText = 'Слишком много запросов, подождите.';
                            break;
                        }
                        case 509: {
                            errorText = 'Потерян кредит доверия пользователя.';
                            break;
                        }
                        default: {
                            errorText = 'Неизвестная ошибка';
                            break;
                        }
                    }
                    self.setState({
                        errorAuth: true,
                        errorText: errorText,
                        loader: false
                    });
                    setTimeout(() => {
                        self.setState({errorAuth: false});
                    }, 2000);
                }
                self.props.ws.delay();
            }
        );
    },
    onFormSubmit(e) {
        e.preventDefault();
        this.checkLogin();
    },
    registration() {
        this.props.changePage('reg');
    },
    render() {
        return (<div className={
            cn('row fill center', {loader: this.state.loader})
        }>
            <form
                className="column center fix form-auth"
                onSubmit={this.onFormSubmit}
            >
                <div className="pad-item fix">
                    <input
                        value={this.state.username}
                        autoFocus={true}
                        name="username"
                        type="text"
                        placeholder="Логин"
                        onChange={this.handleChange}
                        onKeyDown={this.keyHandler}
                    />
                </div>
                <div className="pad-item fix">
                    <input
                        value={this.state.password}
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        onChange={this.handleChange}
                        onKeyDown={this.keyHandler}
                    />
                </div>
                <div className="pad-item row auth-btn-block fix">
                    <div>
                        <button
                            className="btn-second btn-auth"
                            type="button"
                            onClick={this.registration}
                        >
                            Регистрация
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn-main btn-auth"
                            type="submit"
                        >
                            Войти
                        </button>
                    </div>
                </div>
                <div className="pad-item fix error-auth" style={{
                    visibility: (this.state.errorAuth) ? '' : 'hidden'
                }}>{this.state.errorText}</div>
            </form>
        </div>);
    }
});