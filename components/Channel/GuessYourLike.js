import React, { Component } from 'react';
import RecommentdVideos from './RecommendVideos';
import fetcher from '../../utils/fetch';

export default class GuessYourLike extends Component {
  state = {
      videos: null
  }

  fetchYousrLikes = async() => {
      const { videoBaseId, limit } = this.props;
      if (!videoBaseId || !limit) return;
      const res = await fetcher('/web/channel/guess/like', { videoBaseId, limit });
      return res.data;
  }

  async componentDidMount() {
      const videos = await this.fetchYousrLikes();
      this.setState({
          videos: videos
      });
  }
  render() {
      const { videos } = this.state;
      return (
          <div style={{ width: '1180px', margin: '0 auto', backgroundColor: '#fff', marginTop: '20px', position: 'relative' }}>
              {
                  videos && videos.length > 0 &&
          <RecommentdVideos
              title='猜你喜欢'
              videos={videos}
          />
              }
          </div>
      );
  }
}
