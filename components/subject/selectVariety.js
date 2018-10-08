import React, { Component } from 'react';
import VideoItem from '../../components/HomePage/SubVideos/VideoItem';
import Pagination from '../../components/search/pagination.js';
import getLink from '../../components/subject/getLink.js';
import classNames from './selectVariety.css';
import cn from 'classnames';

class TvSeries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPage: 0, // 总页数
            nowIndex: 1, // 当前页数
            openList: [], // 当前展示的列表
        };
    }
    componentDidMount() {
        this.getGroup(this.props.workList.length, this.props.pageSize);
    }
  getNumPage = (index) => {
      const { totalPage } = this.state;
      const { workList, pageSize } = this.props;
      let openList = [];
      if (totalPage === 1) return;
      if ((index - 1) === 0) {
          openList = workList.slice(index - 1, index * pageSize);
      } else {
          openList = workList.slice((index - 1) * pageSize, index * pageSize);
      }
      this.setState({ openList, nowIndex: index });
  }
  // 计算初始有多少页
  getGroup(totalItem, pageSize) {
      const totalPage = Math.ceil(Number(totalItem) / Number(pageSize));
      this.setState({ totalPage });
      let openList = [];
      // console.log(totalPage)
      if (!totalPage || totalPage === 0) return (this.setState({ worknum: ['暂无'] }));
      if (totalPage === 1) {
          openList = this.props.workList.slice(0, totalItem);
      } else if (totalPage > 1) {
          openList = this.props.workList.slice(0, pageSize);
      }
      this.setState({ openList });
  }
  render() {
      const { openList, totalPage, nowIndex } = this.state;
      return (
          <article className={cn(classNames['wrapper'], 'clearfix')}>
              <div className={classNames['variety-wrap']}>
                  <span>选集</span>
                  <div className={cn(classNames['variety-list'], 'clearfix')}>
                      {
                          openList && openList.map((item, index) => {
                              let linkProps = getLink(item);
                              let image = item.images && item.images.find(image => {
                                  return image.scale === 1;
                              });
                              let imageUrl = image && image.url;
                              return (
                                  <VideoItem
                                      key={index}
                                      linkProps={linkProps}
                                      width='180'
                                      height='102'
                                      title={item.title}
                                      subtitle={item.subTitle}
                                      bottomRightStr={`${item.episodeDisplay}期`}
                                      imgUrl={imageUrl}
                                  >
                                  </VideoItem>
                              );
                          })
                      }
                  </div>
                  {
                      openList && openList.length === 0 || totalPage === 1
                          ? '' : <section className={classNames['page-wrap']}>
                              <Pagination
                                  totalPage={totalPage}
                                  currentPage={nowIndex}
                                  onPageChange={this.getNumPage}
                              />
                          </section>
                  }
              </div>
          </article>
      );
  }
}

export default TvSeries;
