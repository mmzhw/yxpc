import React, { Component } from 'react';
import SubVideos from '../SubVideos';
import SubColumnContentSwiper from '../SubVideos/SubColumnContentSwiper';
import VideoItemForSwiper from '../SubVideos/VideoItemForSwiper';
import SubVideoHeader from '../SubVideos/SubVideoHeader';
import propTypes from 'prop-types';
import getLinkProps from './getLinkProps';
import { handleImgUrl } from '../../../utils/handleUrl';

export default class VideosTepl extends Component {
    static propTypes = {
        cards: propTypes.object
    }

    render() {
        const { cards, needkey, cardsName, layoutId, model } = this.props;
        const showCards = cards;
        let videos = showCards && showCards.videos;
        let swiperOption = {};
        let isSwiper = false;
        switch (layoutId) {
            case 2:
                swiperOption = {
                    slidesPerColumn: 2,
                    slidesPerView: 6,
                    spaceBetween: 14,
                    slidesPerColumnFill: 'row'
                };
                isSwiper = videos.length > 12;
                break;
            case 5:
                swiperOption = {
                    slidesPerView: 4,
                    spaceBetween: 14
                };
                isSwiper = videos.length > 4;
                break;
            case 6:
                swiperOption = {
                    slidesPerColumn: 3,
                    slidesPerView: 2,
                    spaceBetween: 14,
                    slidesPerGroup: 2,
                    slidesPerColumnFill: 'row'
                };
                isSwiper = videos.length > 6;
                break;
            default:
                swiperOption = {
                    slidesPerView: 6,
                    spaceBetween: 14
                };
                isSwiper = videos.length > 6;
        };
        if (layoutId === 6) {
            videos = transArray(videos);
        }
        return (
            <div>
                <SubVideoHeader subVideoName={cardsName} model={model} showMoreHref={showCards.more ? showCards.moreUrl : ''}></SubVideoHeader>
                <SubVideos selectClass style={{ background: model.buttomStyleType !== 0 ? 'rgba(255,255,255,0.6)' : `url(${handleImgUrl(model.imgButtomStyleUrl)}) no-repeat center center` }}>
                    <SubColumnContentSwiper needData={videos} key={needkey} layoutId={layoutId} swiperOption={swiperOption} isSwiper={isSwiper} swiperClass={'videos-special' + needkey}>
                        {
                            videos && videos.map((video, index) => {
                                let needVideo = {}; needVideo.videoBaseId = video.videoId;
                                needVideo = { ...video, ...needVideo };
                                const linkProps = getLinkProps(needVideo);
                                let w, h;
                                switch (layoutId) {
                                    case 5:
                                        w = '277';
                                        h = '417';
                                        break;
                                    case 6:
                                        w = '565';
                                        h = '318';
                                        break;
                                    default:
                                        w = '180';
                                        h = '102';
                                }
                                return (
                                    video !== '' ? <VideoItemForSwiper
                                        targetBlank
                                        key={video.videoId + video.name + index}
                                        linkProps={linkProps}
                                        width={w}
                                        height={h}
                                        title={video.name}
                                        subtitle={video.subName}
                                        topRightStr={video.extMap && video.extMap.sign}
                                        topLeftStr={video.extMap && video.extMap.clarity}
                                        bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                        url={video.url}
                                        imgUrl={video.imageUrl}
                                    >
                                    </VideoItemForSwiper>
                                        : <VideoItemForSwiper
                                            style={{ visibility: 'hidden' }}
                                            key={videos[0].videoId + videos[0].name + videos.length}
                                            width={565}
                                            height={318}
                                        />
                                );
                            })
                        }
                    </SubColumnContentSwiper>
                </SubVideos>
            </div>
        );
    }
}

const transArray = array => {
    var fArray = [];
    var sArray = [];
    var tArray = [];
    for (var index = 0; index < Math.abs((0 - array.length % 6)); index++) {
        array.push('');
    }
    for (var i = 0; i < array.length; i++) {
        if (i % 6 === 0 || i % 6 === 1) {
            fArray.push(array[i]);
        }
        if (i % 6 === 2 || i % 6 === 3) {
            sArray.push(array[i]);
        }
        if (i % 6 === 4 || i % 6 === 5) {
            tArray.push(array[i]);
        }
    }
    return fArray.concat(sArray).concat(tArray);
};
