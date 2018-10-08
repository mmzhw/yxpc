import React, { Component } from 'react';
import SubVideos from '../HomePage/SubVideos/';
import SubVideoContent from '../HomePage/SubVideos/SubVideoContent';
import SubVideoHeader from '../HomePage/SubVideos/SubVideoHeader';
import VideoItem from '../HomePage/SubVideos/VideoItem';
import propTypes from 'prop-types';
import _ from 'lodash';
import getLinkProps from '../../components/HomePage/VideosTepl/getLinkProps';

export default class RecommendVideos extends Component {
  static propTypes = {
      title: propTypes.string,
      videos: propTypes.array
  }

  render() {
      const { videos, title } = this.props;
      return (
      // <SubVideoContentSwiper isSwiper={false}>
      //   {
      //     videos && videos.map(video => {
      //       const linkProps = getLinkProps(video)
      //       return (
      //         <VideoItemForSwiper
      //           key={video.videoBaseId}
      //           linkProps={linkProps}
      //           width='180'
      //           height='102'
      //           title={video.name}
      //           subtitle={video.subName}
      //           topRightStr={video.extMap && video.extMap.sign}
      //           bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
      //           url={video.url}
      //         >
      //         </VideoItemForSwiper>
      //       )
      //     })
      //   }
      // </SubVideoContentSwiper>
          <SubVideos>
              <SubVideoHeader subVideoName={title}></SubVideoHeader>
              <SubVideoContent>
                  {
                      videos && videos.map((video, index) => {
                          const linkProps = getLinkProps(video);
                          const image = _.find(video.images, image => {
                              return image.scale === 1;
                          });
                          const imageUrl = image && image.url;
                          return (
                              <VideoItem
                                  key={video.videoBaseId}
                                  linkProps={linkProps}
                                  width='180'
                                  height='102'
                                  title={video.name}
                                  subtitle={video.subName}
                                  topRightStr={video.extMap && video.extMap.sign}
                                  bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                  imgUrl={imageUrl}
                                  style={{ marginRight: (index === videos.length - 1) ? '0' : '20px' }}
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
