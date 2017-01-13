const React = require('react');
const ScrollThumb = require('../scroll');
const ResizeDetector = require('../resize-detector');
const keycode = require('keycode');

module.exports = React.createClass({
    displayName: 'Scrollable',
    getInitialState() {
        return {
            scroll: 0,
            outerHeight: 1,
            innerHeight: 1,
            maxScroll: 1
        };
    },
    onWheel(e) {
        e.preventDefault();
        const delta = e.deltaY;
        let offsetBottom = this.state.scroll - delta;
        const negative = offsetBottom < 0;
        negative && (offsetBottom = 0);
        const higherMax = offsetBottom > this.state.maxScroll;
        higherMax && (offsetBottom = this.state.maxScroll);
        this.setScroll(offsetBottom);
    },
    setScroll(y) {
        this.setState({
            scroll: y
        });
    },
    onResizeOuter(e) {
        const outH = e.target.value.height;
        const inH = this.state.innerHeight;
        this.setState({
            outerHeight: outH,
            maxScroll: (1 - outH / inH) * outH
        });
    },
    onResizeInner(e) {
        const outH = this.state.outerHeight;
        const inH = (e.target.value.height === 0) ? 1 : e.target.value.height;
        this.setState({
            innerHeight: inH,
            maxScroll: (1 - outH / inH) * outH,
            scroll: 0
        });
    },
    keyScroll(num) {
        const scroll = this.state.scroll;
        const newScroll = Math.min((
            (scroll + num > 0) ? scroll + num : 0),
            this.state.maxScroll
        );
        if (newScroll <= this.state.maxScroll && newScroll >= 0) {
            this.setState({scroll: newScroll});
        }
    },
    scrollFullScreen(sign) {
        const outH = this.state.outerHeight;
        const inH = this.state.innerHeight;
        const k = sign * (outH / inH) * outH;
        this.keyScroll(k);
    },
    keyHandler(e) {
        const kbdMoveDistancePx = 10;
        switch (keycode(e)) {
            case 'up': {
                this.keyScroll(kbdMoveDistancePx);
                break;
            }
            case 'down': {
                this.keyScroll(-kbdMoveDistancePx);
                break;
            }
            case 'space': {
                this.scrollFullScreen(((e.shiftKey) ? 1 : -1));
                break;
            }
            case 'page up': {
                this.scrollFullScreen(1);
                break;
            }
            case 'page down': {
                this.scrollFullScreen(-1);
                break;
            }
            default: {
                break;
            }
        }
    },
    render() {
        const outH = this.state.outerHeight;
        const inH = this.state.innerHeight;
        const scroll = this.state.scroll;
        const children = this.props.children;
        const maxScroll = this.state.maxScroll;
        const scrollSpace = Math.max(inH - outH, outH - inH);
        const position = Math.min(
             scroll / ((maxScroll === 0) ? 1 : maxScroll), 1
        );
        const visibilityThumb = outH > inH;
        const scrollBottom = visibilityThumb ? 0 : position * scrollSpace;
        return (<div
            ref="sOuter"
            onWheel={this.onWheel}
            className="scroll-outer fill"
            tabIndex="2"
            onKeyDown={this.keyHandler}
        >
            <ResizeDetector onResize={this.onResizeOuter} />
            <div className="scroll-cont absfill">
                <div className="scroll-inner scrollable" style={{
                        bottom: -scrollBottom
                    }}>
                    <ResizeDetector onResize={this.onResizeInner} />
                    {children}
                </div>
            </div>
            <ScrollThumb
                position={position}
                scroll={this.state.scroll}
                setScroll={this.setScroll}
                maxScroll={maxScroll}
                outerHeight={outH}
                innerHeight={inH}
                visibilityThumb={visibilityThumb}
            />
        </div>);
    }
});