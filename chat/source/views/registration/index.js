const React = require('react');
const _ = require('lodash');
const cn = require('classnames');

module.exports = React.createClass({
    displayName: 'Registration',
    getInitialState() {
        return {
            username: '',
            password: '',
            repeatp: '',
            passwordValid: false,
            errorRegistr: false,
            errorText: 'Выбранный логин уже занят.',
            loader: false
        };
    },
    handleChange: function(event) {
        let state = _.extend({}, this.state);
        state[event.target.name] = event.target.value;
        state.passwordValid = (state.password == state.repeatp);
        this.setState(state);
    },
    registration() {
        this.setState({loader: true});
        let self = this;
        this.props.ws.call(
            'registration',
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
                    self.printError(errorText);
                    self.setState({loader: false});
                }
                self.props.ws.delay();
            }
        );
    },
    printError(errorText) {
        this.setState({
            errorRegistr: true,
            errorText: errorText
        });
        setTimeout(() => {
            this.setState({errorRegistr: false});
        }, 2000);
    },
    onFormSubmit(e) {
        e.preventDefault();
        if (this.valid()) {
            this.registration();
        }
    },
    valid() {
        let error = '';
        if (this.state.password.length === 0 ||
            this.state.repeatp.length === 0 ||
            this.state.username.length === 0
        ) {
            error = 'Заполнены не все поля.';
        }
        if (!this.state.passwordValid &&
            (this.state.password.length !== 0 ||
            this.state.repeatp.length !== 0)
        ) {
            error = 'Введенные пароли не совпадают.';
        }
        const valid = (error.length > 0);
        valid && this.printError(error);
        return !valid;
    },
    auth() {
        this.props.changePage('login');
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
                <div className="pad-item fix">
                    <input
                        value={this.state.repeatp}
                        name="repeatp"
                        type="password"
                        placeholder="Повторите пароль"
                        onChange={this.handleChange}
                        onKeyDown={this.keyHandler}
                    />
                </div>
                <div className="pad-item row auth-btn-block fix">
                    <div>
                        <button
                            className="btn-second btn-auth"
                            type="button"
                            onClick={this.auth}
                        >
                            Войти
                        </button>
                    </div>
                    <div>
                        <button
                            className="btn-main btn-auth"
                            type="submit"
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
                <div className="pad-item fix error-auth" style={{
                    visibility: (this.state.errorRegistr) ? '' : 'hidden'
                }}>{this.state.errorText}</div>
            </form>
        </div>);
    }
});