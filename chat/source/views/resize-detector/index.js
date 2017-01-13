const React = require('react');

module.exports = React.createClass({
    displayName: 'ResizeDetector',
    getInitialState() {
        return {
            width: 0,
            height: 0
        };
    },
    render() {
        return <iframe
            ref="frame"
            className="absfill iframe-reset"
            tabIndex="-1"
        />;
    },
    componentDidMount() {
        const contentWindow = this.refs.frame.contentWindow;
        contentWindow.addEventListener('resize', this.resize);
        this.resize();
    },
    componentWillUnmount() {
        const contentWindow = this.refs.frame.contentWindow;

        contentWindow.removeEventListener('resize', this.resize);
        this.resize();
    },
    shouldComponentUpdate() {
        return false;
    },
    resize() {
        const onResize = this.props.onResize;
        onResize && onResize({target: {value: this.updateSize()}});
    },
    updateSize() {
        const wnd = this.refs.frame.contentWindow;
        const newState = {
            width: wnd.innerWidth,
            height: wnd.innerHeight
        };
        this.setState(newState);
        return newState;
    }
});