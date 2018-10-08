import React from 'react';
import classNames from './style.css';
import { handleImgUrl } from '../../../utils/handleUrl';
import LazyImage from './LazyImage';
import Link from 'next/link';
import UrlSelect from './linkSelect';

const VideoItem = (props) => {
    let imgUrl = handleImgUrl(props.imgUrl);
    const title = props.live ? 'title_two' : 'title';
    const content = props.live ? 'content_two' : 'content';
    if (imgUrl) {
        if (imgUrl.indexOf('imageView') < 0) {
            imgUrl += '?imageView2/2/w/500/q/90';
        }
    } else {
        imgUrl = `../../../static/image/video-cover-${props.width}x${props.height}.png`;
    }

    return (
        <div className={classNames['video-item-wraps'] + ' ' + 'swiper-slide'} style={props.style || {}}>
            <UrlSelect urlSelectData={props.linkProps} targetBlank={!!props.targetBlank}>
                <LazyImage
                    width={props.width}
                    height={props.height}
                    className={classNames['video-img']}
                    src={imgUrl} alt=''/>
                {
                    props.topRightStr && <span className={classNames['exclusive-play']}>{props.topRightStr}</span>
                }
                {
                    props.topLeftStr && <span className={classNames['exclusive-clarity']}>{props.topLeftStr}</span>
                }
                {
                    props.bottomRightStr && <span className={classNames['episode-info']}>{props.bottomRightStr}</span>
                }
            </UrlSelect>
            <div className={classNames['video-footer']}>
                <Link {...props.linkProps}>
                    <a className={classNames[title]} style={{ width: `${props.width}px` }} href={props.url} title={props.title}>{props.title}</a>
                </Link>
                <div className={classNames[content]} style={{ width: `${props.width}px` }}>{props.subtitle}</div>
            </div>
        </div>
    );
};

export default VideoItem;
