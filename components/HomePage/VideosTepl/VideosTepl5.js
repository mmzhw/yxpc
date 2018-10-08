import React, { Component } from 'react';
import SubVideos from '../SubVideos';
import SubVideoContentSwiper from '../SubVideos/SubVideoContentSwiper';
import VideoItemForSwiper from '../SubVideos/VideoItemForSwiper';
import SubVideoHeader from '../SubVideos/SubVideoHeader';
import getLinkProps from './getLinkProps';
import propTypes from 'prop-types';

export default class VideosTepl extends Component {
  static propTypes = {
      cards: propTypes.array
  }
  render() {
      const { cards } = this.props;
      const showCards = cards && cards[0];
      const videos = showCards && showCards.videos;
      return (
          <SubVideos>
              <SubVideoHeader subVideoName={showCards.title} showMoreHref={showCards.more ? showCards.moreUrl : ''}></SubVideoHeader>
              <SubVideoContentSwiper key='1' isSwiper swiperClass='videos-tepl5' swiperOption={{ slidesPerView: 6, spaceBetween: 20 }}>
                  {
                      videos.map((video, index) => {
                          const linkProps = getLinkProps(video);
                          return (
                              <VideoItemForSwiper
                                  key={video.videoBaseId + video.name + index}
                                  linkProps={linkProps}
                                  width='180'
                                  height='270'
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
