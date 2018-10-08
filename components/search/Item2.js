import React, { Component } from 'react';
import Link from 'next/link';
import classNames from './item2.css';
import cn from 'classnames';
import { imgPrefix } from '../../utils/url';

class Item2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    getImgUrl(images) {
        const item = images.filter((image) => { return image.scale === 1; })[0];
        let url;
        if (item !== undefined) {
            url = item.url;
        } else {
            url = '';
        }
        return imgPrefix + url;
    }
    fixNum(num) {
        if (num > 9 || num === 0) {
            return num;
        } else {
            return '0' + num;
        }
    }
    transPlayTime(time) {
        const hour = Math.floor((time / 3600) % 24);
        const min = this.fixNum(Math.floor((time / 60) % 60));
        const sec = this.fixNum(Math.floor(time % 60));
        return hour + ':' + min + ':' + sec;
    }
    render() {
        return (
            <Link as={`/play/${this.props.videoBaseId}`} href={{ pathname: '/play', query: { baseId: this.props.videoBaseId, from: 'search' }}}>
                <a>
                    <article className={cn(classNames['item'], 'clearfix')}>
                        <div className={classNames['img-wrap']}>
                            <img src={this.getImgUrl(this.props.images)}/>
                            <p className={classNames['duration']}>{this.transPlayTime(this.props.duration)}</p>
                            {this.props.clarity && <div className={classNames['clarity']}>{this.props.clarity}</div>}
                            {this.props.sign && <div className={classNames['sign']}>{this.props.sign}</div>}
                        </div>
                        <div className={classNames['text-wrap']}>
                            <p className={classNames['name']}>{ this.props.name }</p>
                            <p className={classNames['sub-name']}>{ this.props.subName }</p>
                        </div>
                    </article>
                </a>
            </Link>
        );
    }
}

export default Item2;
