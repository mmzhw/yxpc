import React, { Component } from 'react';
import SubVideos from '../SubVideos';
import SubVideoHeader from '../SubVideos/SubVideoHeader';
import SubVideoContent from '../SubVideos/SubVideoContent';
import VideoItem from '../SubVideos/VideoItem';
import getLinkProps from './getLinkProps';
import propTypes from 'prop-types';

export default class VideosTepl extends Component {
  static propTypes = {
      cards: propTypes.array
  }

  render() {
      const { cards, selectClass } = this.props;
      const backgroundColor = selectClass ? 'rgba(255,255,255,0.1)' : '#fff';
      const showCards1 = cards && cards[0];
      const showCards2 = cards && cards[1];
      const videos1 = showCards1 && showCards1.videos.slice(0, 3);
      const videos2 = showCards1 && showCards1.videos.slice(3, 6);
      const videos3 = showCards2 && showCards2.videos.slice(0, 3);
      const videos4 = showCards2 && showCards2.videos.slice(3, 6);
      return (
          <div className='sub-videos-wrap' style={{ width: '100%', backgroundColor: backgroundColor, marginTop: '20px' }}>
              <SubVideos selectClass={selectClass} key='1' style={{ display: 'inline-block', marginRight: '20px' }}>
                  <SubVideoHeader subVideoName={showCards1 && showCards1.title} showMoreHref={showCards1 && showCards1.more ? showCards1.moreUrl : ''}/>
                  <SubVideoContent key='2'>
                      {
                          videos1 && videos1.map((video, index, array) => {
                              const linkProps = getLinkProps(video);
                              if (index !== array.length - 1) {
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
                                          imgUrl={video && video.image && video.image.url}
                                          style={{ marginRight: '20px' }}
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
                                          /* url={video.url} */
                                          imgUrl={video && video.image && video.image.url}
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
                              const linkProps = getLinkProps(video);
                              if (index !== array.length - 1) {
                                  return (
                                      <VideoItem
                                          linkProps={linkProps}
                                          key={video.videoBaseId + video.name + index}
                                          width='180'
                                          height='102'
                                          title={video.name}
                                          subtitle={video.subName}
                                          topRightStr={video.extMap && video.extMap.sign}
                                          topLeftStr={video.extMap && video.extMap.clarity}
                                          bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                          imgUrl={video && video.image && video.image.url}
                                          style={{ marginRight: '20px' }}
                                      >
                                      </VideoItem>
                                  );
                              } else {
                                  return (
                                      <VideoItem
                                          linkProps={linkProps}
                                          key={video.videoBaseId + video.name + index}
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
              {
                  showCards2 &&
          <SubVideos selectClass={selectClass} key='4' style={{ display: 'inline-block', paddingRight: '0', boxShadow: '0 0 0 0 #FFF', margin: '0' }}>
              <SubVideoHeader subVideoName={showCards2 && showCards2.title} showMoreHref={showCards2 && showCards2.more ? showCards2.moreUrl : ''}></SubVideoHeader>
              <SubVideoContent key='5'>
                  {
                      videos3 && videos3.map((video, index, array) => {
                          const linkProps = getLinkProps(video);
                          if (index !== array.length - 1) {
                              return (
                                  <VideoItem
                                      linkProps={linkProps}
                                      key={video.videoBaseId + video.name + index}
                                      width='180'
                                      height='102'
                                      title={video.name}
                                      subtitle={video.subName}
                                      topRightStr={video.extMap && video.extMap.sign}
                                      topLeftStr={video.extMap && video.extMap.clarity}
                                      bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                      url={video.url}
                                      imgUrl={video && video.image && video.image.url}
                                      style={{ marginRight: '20px' }}
                                  >
                                  </VideoItem>
                              );
                          } else {
                              return (
                                  <VideoItem
                                      linkProps={linkProps}
                                      key={video.videoBaseId + video.name + index}
                                      width='180'
                                      height='102'
                                      title={video.name}
                                      subtitle={video.subName}
                                      topRightStr={video.extMap && video.extMap.sign}
                                      topLeftStr={video.extMap && video.extMap.clarity}
                                      bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                      imgUrl={video && video.image && video.image.url}
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
                          const linkProps = getLinkProps(video);
                          if (index !== array.length - 1) {
                              return (
                                  <VideoItem
                                      linkProps={linkProps}
                                      key={video.videoBaseId + video.name + index}
                                      width='180'
                                      height='102'
                                      title={video.name}
                                      subtitle={video.subName}
                                      topRightStr={video.extMap && video.extMap.sign}
                                      topLeftStr={video.extMap && video.extMap.clarity}
                                      bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                      imgUrl={video && video.image && video.image.url}
                                      style={{ marginRight: '20px' }}
                                  >
                                  </VideoItem>
                              );
                          } else {
                              return (
                                  <VideoItem
                                      linkProps={linkProps}
                                      key={video.videoBaseId + video.name + index}
                                      width='180'
                                      height='102'
                                      title={video.name}
                                      subtitle={video.subName}
                                      topRightStr={video.extMap && video.extMap.sign}
                                      topLeftStr={video.extMap && video.extMap.clarity}
                                      bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                      imgUrl={video && video.image && video.image.url}
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
      );
  }
}
