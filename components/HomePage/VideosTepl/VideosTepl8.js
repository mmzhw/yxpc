import React, { Component } from 'react';
import SubVideos from '../SubVideos';
import SubVideoHeader from '../SubVideos/SubVideoHeader';
import SubVideoContent from '../SubVideos/SubVideoContent';
import VideoItem from '../SubVideos/VideoItem';
import getLinkProps from './getLinkProps';
import classNames from '../SubVideos/style.css';
import { handleImgUrl } from '../../../utils/handleUrl';

export default class VideosTepl extends Component {
    render() {
        const { cards, selectClass, cardsName, cardsName2, model } = this.props;
        const backgroundColor = selectClass ? 'rgba(255,255,255,0.6)' : '#fff';
        const showCards1 = cards.videos;
        const videos1 = showCards1 && showCards1.filter((item) => item.sort < 4);
        const videos2 = showCards1 && showCards1.filter((item) => item.sort > 3 && item.sort < 7);
        const videos3 = showCards1 && showCards1.filter((item) => item.sort > 6 && item.sort < 10);
        const videos4 = showCards1 && showCards1.filter((item) => item.sort > 9 && item.sort < 13);
        return (
            <div className={classNames['card-column-2']}>
                {
                    model.titleStyleType ? (
                        <div className={classNames['img-title']}>
                            <img src={handleImgUrl(model.imgTitleStyleUrl)}/>
                        </div>
                    ) : (
                        <div className={classNames['card-column-2-hd']}>
                            <SubVideoHeader subVideoName={cardsName} showMoreHref={showCards1 && showCards1.more ? showCards1.moreUrl : ''}/>
                            <SubVideoHeader subVideoName={cardsName2} showMoreHref={showCards1 && showCards1.more ? showCards1.moreUrl : ''}/>
                        </div>
                    )
                }

                <div className='sub-videos-wrap' style={{ overflow: 'auto', overflowY: 'hidden', display: 'flex', width: '1180px', background: model.buttomStyleType !== 0 ? backgroundColor : `url(${handleImgUrl(model.imgButtomStyleUrl)}) center center / cover no-repeat`, margin: '0 auto' }}>
                    <SubVideos selectClass={selectClass} key='1' style={{ display: 'inline-block', paddingRight: '0', margin: '0' }}>
                        <SubVideoContent key='2'>
                            {
                                videos1 && videos1.map((video, index, array) => {
                                    let needVideo = {}; needVideo.videoBaseId = video.videoId;
                                    needVideo = { ...video, ...needVideo };
                                    const linkProps = getLinkProps(needVideo);
                                    if (index !== array.length - 1) {
                                        return (
                                            <VideoItem
                                                targetBlank
                                                key={video.videoId + video.name + index}
                                                linkProps={linkProps}
                                                width='180'
                                                height='102'
                                                title={video.name}
                                                subtitle={video.subName}
                                                topRightStr={video.extMap && video.extMap.sign}
                                                topLeftStr={video.extMap && video.extMap.clarity}
                                                bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                                /* url={video.url} */
                                                imgUrl={video && video.imageUrl}
                                            >
                                            </VideoItem>
                                        );
                                    } else {
                                        return (
                                            <VideoItem
                                                targetBlank
                                                key={video.videoBaseId + video.name + index}
                                                linkProps={linkProps}
                                                width='180'
                                                height='102'
                                                title={video.name}
                                                subtitle={video.subName}
                                                topRightStr={video.extMap && video.extMap.sign}
                                                topLeftStr={video.extMap && video.extMap.clarity}
                                                bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                                /* url={video.url} */
                                                imgUrl={video && video.imageUrl}
                                            >
                                            </VideoItem>
                                        );
                                    }
                                })
                            }
                        </SubVideoContent>
                        <SubVideoContent key='3'>
                            {
                                videos2 && videos2.map((video, index, array) => {
                                    let needVideo = {}; needVideo.videoBaseId = video.videoId;
                                    needVideo = { ...video, ...needVideo };
                                    const linkProps = getLinkProps(needVideo);
                                    if (index !== array.length - 1) {
                                        return (
                                            <VideoItem
                                                targetBlank
                                                linkProps={linkProps}
                                                key={video.videoId + video.name + index}
                                                width='180'
                                                height='102'
                                                title={video.name}
                                                subtitle={video.subName}
                                                topRightStr={video.extMap && video.extMap.sign}
                                                topLeftStr={video.extMap && video.extMap.clarity}
                                                bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                                imgUrl={video && video.imageUrl}
                                            >
                                            </VideoItem>
                                        );
                                    } else {
                                        return (
                                            <VideoItem
                                                targetBlank
                                                linkProps={linkProps}
                                                key={video.videoId + video.name + index}
                                                width='180'
                                                height='102'
                                                title={video.name}
                                                subtitle={video.subName}
                                                topRightStr={video.extMap && video.extMap.sign}
                                                topLeftStr={video.extMap && video.extMap.clarity}
                                                bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                                url={video.url}
                                                imgUrl={video && video.imageUrl}
                                            >
                                            </VideoItem>
                                        );
                                    }
                                })
                            }
                        </SubVideoContent>
                    </SubVideos>
                    {
                        showCards1 &&
                        <SubVideos selectClass={selectClass} key='4' style={{ display: 'inline-block', paddingRight: '0', margin: '0' }}>
                            <SubVideoContent key='5'>
                                {
                                    videos3 && videos3.map((video, index, array) => {
                                        let needVideo = {}; needVideo.videoBaseId = video.videoId;
                                        needVideo = { ...video, ...needVideo };
                                        const linkProps = getLinkProps(needVideo);
                                        if (index !== array.length - 1) {
                                            return (
                                                <VideoItem
                                                    targetBlank
                                                    linkProps={linkProps}
                                                    key={video.videoId + video.name + index}
                                                    width='180'
                                                    height='102'
                                                    title={video.name}
                                                    subtitle={video.subName}
                                                    topRightStr={video.extMap && video.extMap.sign}
                                                    topLeftStr={video.extMap && video.extMap.clarity}
                                                    bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                                    url={video.url}
                                                    imgUrl={video && video.imageUrl}
                                                >
                                                </VideoItem>
                                            );
                                        } else {
                                            return (
                                                <VideoItem
                                                    targetBlank
                                                    linkProps={linkProps}
                                                    key={video.videoId + video.name + index}
                                                    width='180'
                                                    height='102'
                                                    title={video.name}
                                                    subtitle={video.subName}
                                                    topRightStr={video.extMap && video.extMap.sign}
                                                    topLeftStr={video.extMap && video.extMap.clarity}
                                                    bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                                    imgUrl={video && video.imageUrl}
                                                >
                                                </VideoItem>
                                            );
                                        }
                                    })
                                }
                            </SubVideoContent>
                            <SubVideoContent key='6'>
                                {
                                    videos4 && videos4.map((video, index, array) => {
                                        let needVideo = {}; needVideo.videoBaseId = video.videoId;
                                        needVideo = { ...video, ...needVideo };
                                        const linkProps = getLinkProps(needVideo);
                                        if (index !== array.length - 1) {
                                            return (
                                                <VideoItem
                                                    targetBlank
                                                    linkProps={linkProps}
                                                    key={video.videoId + video.name + index}
                                                    width='180'
                                                    height='102'
                                                    title={video.name}
                                                    subtitle={video.subName}
                                                    topRightStr={video.extMap && video.extMap.sign}
                                                    topLeftStr={video.extMap && video.extMap.clarity}
                                                    bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                                    imgUrl={video && video.imageUrl}
                                                >
                                                </VideoItem>
                                            );
                                        } else {
                                            return (
                                                <VideoItem
                                                    targetBlank
                                                    linkProps={linkProps}
                                                    key={video.videoId + video.name + index}
                                                    width='180'
                                                    height='102'
                                                    title={video.name}
                                                    subtitle={video.subName}
                                                    topRightStr={video.extMap && video.extMap.sign}
                                                    topLeftStr={video.extMap && video.extMap.clarity}
                                                    bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                                    imgUrl={video && video.imageUrl}
                                                >
                                                </VideoItem>
                                            );
                                        }
                                    })
                                }
                            </SubVideoContent>
                        </SubVideos>

                    }
                </div>
            </div>
        );
    }
}
