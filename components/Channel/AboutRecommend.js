import React, { Component } from 'react';
import RecommentdVideos from './RecommendVideos';
import fetcher from '../../utils/fetch';
import classNames from './style.css';
import cn from 'classnames';

export default class GuessYourLike extends Component {
  state = {
      videos: null
  }

  fetchRecommends = async() => {
      const { videoBaseId, limit } = this.props;
      if (!videoBaseId || !limit) return;
      const res = await fetcher('/web/channel/recommend', { videoBaseId, limit });
      const videos = res.data;
      this.setState({
          videos: videos
      });
  }

  async componentDidMount() {
      this.fetchRecommends();
  }
  render() {
      const { videos } = this.state;
      return (
          <div style={{ width: '1180px', margin: '0 auto', backgroundColor: '#fff', marginTop: '20px', position: 'relative' }}>
              {
                  videos && videos.length > 0 &&
        <div>
            <span className={classNames['about-r']} onClick={this.fetchRecommends}>
          换一批
                <span className={cn('iconfont', 'icon-refresh', classNames['about-icon'])}></span>
            </span>
            <RecommentdVideos
                title='相关推荐'
                videos={videos}
            />
        </div>
              }
          </div>
      );
  }
}
