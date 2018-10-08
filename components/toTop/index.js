import React, { Component } from 'react';
import classNames from './index.css';
import { cloneDeep } from 'lodash';
import cn from 'classnames';
import throttle from '../../utils/throttle';
import propTypes from 'prop-types';

class ToTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollHeightToShow: 0,
            show: false,
        };
        this.changeVisibilityIfNecessary = throttle(this.changeVisibilityIfNecessary, 200).bind(this);
        this.onscroll = this.onscroll.bind(this);
    }
    componentDidMount() {
        this.setScrollHeightToShow();
        document.onscroll = this.onscroll;
    }
    setScrollHeightToShow() {
        let { scrollHeightToShow } = this.props;
        this.setState({
            scrollHeightToShow: scrollHeightToShow || 0.5 * window.innerHeight,
        });
    }
    changeVisibilityIfNecessary() {
        let doc = document.documentElement;
        let top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        if (top > this.state.scrollHeightToShow) {
            this.setState({
                show: true,
            });
        } else {
            this.setState({
                show: false,
            });
        }
    }
    onscroll(event) {
        this.changeVisibilityIfNecessary();
    }
    backToTop() {
        document.body.scrollTop = 0; // For Chrome, Safari and Opera
        document.documentElement.scrollTop = 0; // For IE and Firefox
    }

    render() {
        const { style } = this.props;
        const defaultStyle = {
            position: 'fixed',
            right: '2px',
            bottom: '80px',
            zIndex: '100',
        };
        const finalStyle = Object.assign({}, defaultStyle, style);
        if (this.state.show) {
            finalStyle['display'] = 'block';
        } else {
            finalStyle['display'] = 'none';
        }
        return (
            <article className={classNames['toTop']} onClick={this.backToTop} style={finalStyle}>
                <i className={cn(classNames['totop-icon'], 'iconfont icon-totop')}/>
                <span className={classNames['totop-text']}>TOP</span>
            </article>
        );
    }
}

ToTop.propTypes = {
    scrollHeightToShow: propTypes.number,
    style: propTypes.object,
};

export default ToTop;
