const React = require('react');

const MinThumbHeight = 24;
module.exports = React.createClass({
    displayName: 'Scroll',
    getInitialState() {
        return {
            scroll: false,
            y1: 'none',
            y2: 'none',
            first: 0,
            blockTroughOnClick: false
        };
    },
    onMouseDownThumb(e) {
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('selectstart', this.stopSelect);
        document.addEventListener('mousedown', this.stopSelect);
        const outH = this.props.outerHeight;
        const firstCoordsThumbY = outH - e.clientY - this.props.scroll;
        this.setState({
            y1: e.clientY,
            first: firstCoordsThumbY,
            scroll: true
        });
    },
    onMouseDownTrough(e) {
        if (!this.state.blockTroughOnClick) {
            const outH = this.props.outerHeight;
            const inH = this.props.innerHeight;
            const k = (outH / inH) * outH;
            const scroll = this.props.scroll;
            if (e.clientY > outH - scroll) {
                this.props.setScroll((scroll - k > 0) ? scroll - k : 0);
            } else {
                this.props.setScroll((scroll + k < outH) ? scroll + k : outH);
            }
        }
    },
    onMouseMove(e) {
        if (this.state.scroll) {
            this.setState({y2: e.clientY});
            this.scroll();
        }
    },
    onMouseUp() {
        this.setState({
            y1: 'none',
            y2: 'none',
            scroll: false
        });
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('selectstart', this.stopSelect);
        document.removeEventListener('mousedown', this.stopSelect);
    },
    stopSelect(e) {
        e.preventDefault();
    },
    scroll() {
        if (this.state.y2 != 'none' && this.state.y1 != 'none') {
            const step = this.state.y1 - this.state.y2;
            const offsetBottom = this.props.scroll + step;
            this.changeScroll(offsetBottom);
        }
    },
    changeScroll(bot) {
        const negative = bot < 0;
        negative && (bot = 0);
        const higherMax = bot > this.props.maxScroll;
        higherMax && (bot = this.props.maxScroll);
        const outH = this.props.outerHeight;
        const inH = this.props.innerHeight;
        const firstCoord = this.state.first;
        const y2 = this.state.y2;
        const y1 = this.state.y1;
        const thumbPart = Math.min((outH + 0.0) / inH, 1);
        const thumbHeight = Math.max(outH * thumbPart, MinThumbHeight);
        const thumbPositionBot = outH - y2;
        const thumbPositionTop = y2;
        const step = y1 - y2;
        if ((step > 0 && thumbPositionBot > firstCoord) ||
            (step < 0 && thumbPositionTop > thumbHeight - firstCoord)) {
            this.props.setScroll(bot);
        }
        this.setState({
            y1: this.state.y2
        });
    },
    thumbHover(status) {
        this.setState({blockTroughOnClick: status});
    },
    render() {
        const outH = this.props.outerHeight;
        const inH = this.props.innerHeight;
        const thumbPart = Math.min((outH + 0.0) / inH, 1);
        const thumbHeight = Math.max(outH * thumbPart, MinThumbHeight);
        const leftoverHeight = outH - thumbHeight;
        const thumbBottom = this.props.position * leftoverHeight;
        return <div ref="sTrough" className="scroll-trough end column"
                    onMouseDown={this.onMouseDownTrough}>
            <div className="scroll-thumb fix"
                 onMouseOver={() => {this.thumbHover(true);}}
                 onMouseOut={() => {this.thumbHover(false);}}
                 onMouseDown={this.onMouseDownThumb}
                 style={{
                visibility: this.props.visibilityThumb ? 'hidden' : '',
                height: thumbHeight,
                bottom: thumbBottom
            }}></div>
        </div>;
    }
});