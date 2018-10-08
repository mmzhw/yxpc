import React, { Component } from 'react';
import SubVideos from '../SubVideos';
import SubVideoContent from '../SubVideos/SubVideoContent';
import VideoItem from '../SubVideos/VideoItem';
import SubVideoHeader from '../SubVideos/SubVideoHeader';
import getLinkProps from './getLinkProps';
import propTypes from 'prop-types';

export default class VideosTepl extends Component {
  static propTypes = {
      cards: propTypes.array
  }
  render() {
      const { cards } = this.props;
      const showCards = cards[0];
      const videos = showCards.videos;
      const subVideos1 = videos.slice(1, 5);
      const subVideos2 = videos.slice(5, 9);
      const videoItemLinkProps = getLinkProps(videos && videos[0]);
      return (
          <SubVideos >
              <SubVideoHeader subVideoName={showCards.title} showMoreHref={showCards.more ? showCards.moreUrl : ''}></SubVideoHeader>
              <VideoItem
                  style={{ marginRight: '17px' }}
                  linkProps={videoItemLinkProps}
                  width='390'
                  height='263'
                  title={videos[0].name}
                  subtitle={videos[0].subName}
                  topRightStr={videos[0].extMap && videos[0].extMap.sign}
                  topLeftStr={videos[0].extMap && videos[0].extMap.clarity}
                  bottomRightStr={videos[0] && videos[0].extMap && videos[0].extMap.updateEpisode}
                  url={videos[0].url}
                  imgUrl={videos[0] && videos[0].image && videos[0].image.url}
              >
              </VideoItem>
              <SubVideoContent key='1'>
                  {
                      subVideos1.map((video, index, array) => {
                          const linkProps = getLinkProps(video);
                          if (index !== array.length - 1) {
                              return (
                                  <VideoItem
                                      key={video.videoBaseId + video.name + index}
                                      linkProps={linkProps}
                                      style={{ marginRight: '17px' }}
                                      width='180'
                                      height='102'
                                      title={video.name}
                                      subtitle={video.subName}
                                      topRightStr={video.extMap && video.extMap.sign}
                                      topLeftStr={video.extMap && video.extMap.clarity}
                                      bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                      url={video.url}
                                      imgUrl={video && video.image && video.image.url}
                                  >
                                  </VideoItem>
                              );
                          } else {
                              return (
                                  <VideoItem
                                      key={video.videoBaseId + video.name + index}
                                      linkProps={linkProps}
                                      width='180'
                                      height='102'
                                      title={video.name}
                                      subtitle={video.subName}
                                      topRightStr={video.extMap && video.extMap.sign}
                                      topLeftStr={video.extMap && video.extMap.clarity}
                                      bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                      url={video.url}
                                      imgUrl={video && video.image && video.image.url}
                                  >
                                  </VideoItem>
                              );
                          }
                      })
                  }
              </SubVideoContent>
              <SubVideoContent key='2'>
                  {
                      subVideos2.map((video, index, array) => {
                          const linkProps = getLinkProps(video);
                          if (index !== array.length - 1) {
                              return (
                                  <VideoItem
                                      key={video.videoBaseId + video.name + index}
                                      linkProps={linkProps}
                                      style={{ marginRight: '17px' }}
                                      width='180'
                                      height='102'
                                      title={video.name}
                                      subtitle={video.subName}
                                      topRightStr={video.extMap && video.extMap.sign}
                                      topLeftStr={video.extMap && video.extMap.clarity}
                                      bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                      url={video.url}
                                      imgUrl={video && video.image && video.image.url}
                                  >
                                  </VideoItem>
                              );
                          } else {
                              return (
                                  <VideoItem
                                      key={video.videoBaseId + video.name + index}
                                      linkProps={linkProps}
                                      width='180'
                                      height='102'
                                      title={video.name}
                                      subtitle={video.subName}
                                      topRightStr={video.extMap && video.extMap.sign}
                                      topLeftStr={video.extMap && video.extMap.clarity}
                                      bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                      url={video.url}
                                      imgUrl={video && video.image && video.image.url}
                                  >
                                  </VideoItem>
                              );
                          }
                      })
                  }
              </SubVideoContent>
          </SubVideos>
      );
  }
}
