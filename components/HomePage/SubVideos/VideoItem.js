import React, { Component } from 'react';
import Link from 'next/link';
import LazyImage from './LazyImage';
import { handleImgUrl } from '../../../utils/handleUrl';
import classNames from './style.css';
import UrlSelect from './linkSelect';

export default class VideoItem extends Component {
    render() {
        const props = this.props;
        let imgUrl = handleImgUrl(props.imgUrl);
        const title = props.targetBlank ? 'title_two' : 'title';
        const content = props.targetBlank ? 'content_two' : 'content';
        // debugger
        if (imgUrl) {
            if (imgUrl.indexOf('imageView') < 0) {
                imgUrl += '?imageView2/2/w/500/q/90';
            }
        } else {
            imgUrl = `../../../static/image/video-cover-${props.width}x${props.height}.png`;
        }
        let imgStyle = {
            display: 'inline-block',
            width: `${props.width}px`,
            height: `${props.height}px`
        };
        return (
            <div className={classNames['video-item-wraps']} style={props.style || {}}>
                <UrlSelect urlSelectData={props.linkProps} targetBlank={!!props.targetBlank}>
                    <LazyImage
                        width={props.width}
                        height={props.height}
                        className={classNames['video-img']}
                        style={imgStyle}
                        src={imgUrl}/>
                    {
                        props.topRightStr &&
                  <span className={classNames['exclusive-play']}>{props.topRightStr}</span>
                    }
                    {
                        props.topLeftStr &&
                  <span className={classNames['exclusive-clarity']}>{props.topLeftStr}</span>
                    }
                    {
                        props.bottomRightStr &&
                  <span className={classNames['episode-info']}>{props.bottomRightStr}</span>
                    }
                    {
                        props.duration &&
                  <span className={classNames['episode-duration']}>{props.duration}</span>
                    }
                </UrlSelect>
                <div className={classNames['video-footer']}>
                    <Link {...props.linkProps}>
                        <a className={classNames[title]} title={props.title} style={{ width: `${props.width}px`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{props.title}</a>
                    </Link>
                    <div className={classNames[content]} style={{ width: `${props.width}px`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{props.subtitle}</div>
                </div>
            </div>
        );
    }
}
