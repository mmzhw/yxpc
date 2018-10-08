
import React, { Component } from 'react';
import classNames from './style.css';

class SubVideos extends Component {
    render() {
        const { selectClass } = this.props;
        const special = selectClass ? 'sub-videos-column' : 'sub-videos';
        return (
            <div className={classNames[special]} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}

export default SubVideos;
