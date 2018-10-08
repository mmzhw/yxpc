import React, { Component } from 'react';
import SubVideos from '../SubVideos';
import SubVideoContentSwiper from '../SubVideos/SubVideoContentSwiper';
import VideoItemForSwiper from '../SubVideos/VideoItemForSwiper';
import SubVideoHeader from '../SubVideos/SubVideoHeader';
import propTypes from 'prop-types';
import getLinkProps from './getLinkProps';
import classNames from '../../Channel/style1.css';

export default class VideosTepl extends Component {
    static propTypes = {
        cards: propTypes.array
    }

    // 转换时间为月日
    formatDate(scheduleTime) {
        if (scheduleTime) {
            let time = new Date(scheduleTime);
            let month = time.getMonth() + 1;
            let date = time.getDate();
            return month + '月' + date + '日';
        }
    }

    // 临近活动，7天内
    apartDays(scheduleTime) {
        if (Date.parse(new Date()) > scheduleTime) {
            return false;
        }
        let now = Date.parse(new Date());
        let day = (now - scheduleTime) / (24 * 60 * 60 * 1000);
        return day < 7;
    }

    sortActivity(arr) {
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - 1 - i; j++) {
                if (arr[j].activityTime > arr[j + 1].activityTime) {
                    let temp = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }

    render() {
        const { cards, citys, timeLine } = this.props;
        const showCards = cards && cards[0];
        const videos = this.sortActivity(showCards.videos);

        return (
            <SubVideos>
                <SubVideoHeader
                    subVideoName={showCards.title}
                    showMoreHref={showCards.more ? showCards.moreUrl : ''}
                    citys={citys}
                >
                </SubVideoHeader>
                {
                    timeLine
                        ? (
                            <div className={classNames['cityLine']} style={{ marginTop: '0' }}>
                                <div className={classNames['line']}>
                                    <div className={classNames['mask1']}/>
                                    <div className={classNames['mask2']}/>
                                </div>
                                <ul className={classNames['activity']}>
                                    {
                                        videos && videos.map((video, index) => {
                                            let date = video.activityTime;

                                            let spotClass = this.apartDays(date) ? 'nearActivity' : '';
                                            return (
                                                <li key={index}>
                                                    <a>{this.formatDate(date)}</a>
                                                    <i className={classNames[spotClass]}/>
                                                    {
                                                        this.apartDays(date) ? (
                                                            <div className={classNames['near']}>
                                                                <span>即将开始</span>
                                                                <i/>
                                                            </div>
                                                        ) : null
                                                    }
                                                </li>
                                            );
                                        })
                                    }
                                    <div className={classNames['clear']}/>
                                </ul>
                            </div>
                        ) : null
                }
                <SubVideoContentSwiper key='1' isSwiper swiperClass='videos-tepl4'
                    swiperOption={{ slidesPerView: 6, spaceBetween: 20 }}>
                    {
                        videos.map((video, index) => {
                            const linkProps = getLinkProps(video);
                            return (
                                <VideoItemForSwiper
                                    key={video.videoBaseId + video.name + index}
                                    linkProps={linkProps}
                                    width={180}
                                    height={102}
                                    title={video.name}
                                    subtitle={video.subName}
                                    topRightStr={video.extMap && video.extMap.sign}
                                    topLeftStr={video.extMap && video.extMap.clarity}
                                    bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                    url={video.url}
                                    imgUrl={video && video.image && video.image.url}
                                >
                                </VideoItemForSwiper>
                            );
                        })
                    }
                </SubVideoContentSwiper>
            </SubVideos>
        );
    }
}
