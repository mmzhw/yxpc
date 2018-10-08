import React, { Component } from 'react';
import SubVideos from '../SubVideos';
import SubVideoContent from '../SubVideos/SubVideoContent';
import VideoItem from '../SubVideos/VideoItem';
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
      const videos = showCards.videos;
      return (
          <SubVideos>
              <SubVideoHeader subVideoName={showCards.title} showMoreHref={showCards.more ? showCards.moreUrl : ''}></SubVideoHeader>
              <SubVideoContent key='1'>
                  {
                      videos.map((video, index) => {
                          const linkProps = getLinkProps(video);
                          return (
                              <VideoItem
                                  key={video.videoBaseId + video.name + index}
                                  linkProps={linkProps}
                                  width='180'
                                  height='102'
                                  title={video.name}
                                  subtitle={video.subName}
                                  style={{ marginRight: (index === 5 || index === 11) ? '0' : '20px' }}
                                  topRightStr={video.extMap && video.extMap.sign}
                                  topLeftStr={video.extMap && video.extMap.clarity}
                                  bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                  url={video.url}
                                  imgUrl={video && video.image && video.image.url}
                              >
                              </VideoItem>
                          );
                      })
                  }
              </SubVideoContent>
          </SubVideos>
      );
  }
}
