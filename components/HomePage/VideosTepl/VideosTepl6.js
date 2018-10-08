import React, { Component } from 'react';
import SubVideos from '../SubVideos';
import SubVideoContentSwiper from '../SubVideos/SubVideoContentSwiper';
import VideoItemForSwiper from '../SubVideos/VideoItemForSwiper';
import SubVideoHeader from '../SubVideos/SubVideoHeader';
import propTypes from 'prop-types';
import getLinkProps from './getLinkProps';

export default class VideosTepl extends Component {
  static propTypes = {
      cards: propTypes.array
  }
  render() {
      const { cards } = this.props;
      const showCards = cards && cards[0];
      const videos = showCards && showCards.videos;
      const videos1 = videos.slice(0, 6);
      const videos2 = videos.slice(6, 12);
      return (
          <SubVideos>
              <SubVideoHeader subVideoName={showCards.title} showMoreHref={showCards.more ? showCards.moreUrl : ''}></SubVideoHeader>
              <SubVideoContentSwiper key='1' isSwiper={false} swiperClass='videos-tepl6-1'>
                  {
                      videos1 && videos1.map((video, index) => {
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
              <SubVideoContentSwiper key='2' isSwiper={false} swiperClass='videos-tepl6-2'>
                  {
                      videos2 && videos2.map((video, index) => {
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
