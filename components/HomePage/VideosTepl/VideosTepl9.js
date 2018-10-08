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
      const videos = showCards && showCards.videos || [];
      const videosLg = videos.filter(v => v.type === 0);
      const videosSm = videos.filter(v => v.type === 1);
      const swiperOption = {
          slidesPerView: 1
      };
      const swiperOption2 = {
          slidesPerColumn: 2,
          slidesPerView: 2,
          spaceBetween: 16,
          slidesPerColumnFill: 'row'
      };
      return (
          <div>
              <SubVideoHeader subVideoName={cardsName} model={model} showMoreHref={showCards.more ? showCards.moreUrl : ''}></SubVideoHeader>
              <SubVideos selectClass style={{ background: model.buttomStyleType !== 0 ? 'rgba(255,255,255,0.6)' : `url(${handleImgUrl(model.imgButtomStyleUrl)}) no-repeat center center` }}>
                  <div style={{ width: '520px', float: 'left' }}>
                      <SubColumnContentSwiper needData={videosLg} key={'lg' + needkey} layoutId={layoutId} swiperOption={swiperOption} isSwiper swiperClass={'videos-special-lg' + needkey}>
                          {
                              videosLg.map((video, index) => {
                                  let needVideo = {}; needVideo.videoBaseId = video.videoId;
                                  needVideo = { ...video, ...needVideo };
                                  const linkProps = getLinkProps(needVideo);
                                  return (
                                      <VideoItemForSwiper
                                          targetBlank
                                          key={video.videoId + video.name + index}
                                          linkProps={linkProps}
                                          width='520'
                                          height='390'
                                          title={video.name}
                                          subtitle={video.subName}
                                          topRightStr={video.extMap && video.extMap.sign}
                                          topLeftStr={video.extMap && video.extMap.clarity}
                                          bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                          url={video.url}
                                          imgUrl={video.imageUrl}
                                      >
                                      </VideoItemForSwiper>
                                  );
                              })
                          }
                      </SubColumnContentSwiper>
                  </div>
                  <div style={{ width: '610px', float: 'right' }}>
                      <SubColumnContentSwiper needData={videosSm} key={'sm' + needkey} layoutId={layoutId} swiperOption={swiperOption2} isSwiper={false} swiperClass={'videos-special' + needkey}>
                          {
                              videosSm.map((video, index) => {
                                  let needVideo = {}; needVideo.videoBaseId = video.videoId;
                                  needVideo = { ...video, ...needVideo };
                                  const linkProps = getLinkProps(needVideo);
                                  return (
                                      <VideoItemForSwiper
                                          targetBlank
                                          key={video.videoId + video.name + index}
                                          linkProps={linkProps}
                                          width='300'
                                          height='169'
                                          title={video.name}
                                          subtitle={video.subName}
                                          topRightStr={video.extMap && video.extMap.sign}
                                          topLeftStr={video.extMap && video.extMap.clarity}
                                          bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                          url={video.url}
                                          imgUrl={video.imageUrl}
                                      >
                                      </VideoItemForSwiper>
                                  );
                              })
                          }
                      </SubColumnContentSwiper>
                  </div>
                  <div style={{ clear: 'both' }}></div>
              </SubVideos>
          </div>
      );
  }
}
