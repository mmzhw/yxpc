import React, { Component } from 'react';
import Header from '../components/Header';
import Head from 'next/head';
import classNames from './subject.css';
import fetch from '../utils/fetch.js';
import Teleplay from '../components/subject/teleplay.js';
import TvSeries from '../components/subject/selectWork.js';
import Variety from '../components/subject/selectVariety.js';
import AboutRecommend from '../components/Channel/AboutRecommend';
import ToTop from '../components/toTop';
import Footer from '../components/Footer';
import api from '../constants/api.js';
import cn from 'classnames';
import SubVideosCss from '../components/HomePage/SubVideos/SubVideosCss';
import Error from 'next/error';

class Subject extends Component {
  static getInitialProps = async (props) => {
      const subjectRes = await fetch(api.videoInfo, { videoBaseId: props.query.baseId, videoDetailId: props.query.detailId });
      const subjectInfos = subjectRes.data;
      // fetcher(api.videoAddHot, { videoBaseId: props.query.baseId, searchFlag: props.query.from === 'search' ? 1 : 0 })
      return {
          errorCode: subjectRes.code,
          subjectRes,
          subjectInfos,
      };
  }
  setKeyword() {
      let vinfo = this.props.subjectInfos;
      if (vinfo.categories === 2) {
          if (vinfo.bizType === 1) {
              return `${vinfo.name}, ${vinfo.name}在线播放, ${vinfo.name}无广告免费播放, 有象视频, 电视剧, 高清视频在线观看`;
          } else {
              return `${vinfo.name}, ${vinfo.name}在线播放, ${vinfo.name}无广告免费播放, 有象视频，高清视频在线观看`;
          }
      } else {
          return `${vinfo.name}, ${vinfo.name}在线播放, 无广告免费播放, 有象视频, 高清视频在线观看`;
      }
  }
  setDesc() {
      let vinfo = this.props.subjectInfos;
      if (vinfo.categories === 2) {
          if (vinfo.bizType === 1) {
              return `${vinfo.name}, 有象视频电视剧, 高清电视剧在线观看, 剧情简介：${vinfo.intro}`;
          } else {
              return `${vinfo.name}, 在线播放, 有象视频, 高清视频在线观看, ${vinfo.intro}`;
          }
      } else {
          return `${vinfo.name}, 在线播放, 有象视频, 高清视频在线观看, 剧情简介: ${vinfo.intro}`;
      }
  }
  render() {
      // 请求错误处理
      if (this.props.errorCode !== 0) {
          return (<Error statusCode={this.props.errorCode} />);
      }
      const { subjectInfos } = this.props;
      const videoBaseId = this.props.url.query.baseId;
      let bizType = subjectInfos.categories === 2 ? subjectInfos.bizType === 1 ? '电视剧' : '综艺' : '';
      console.log(subjectInfos);
      return (
          <div style={{ paddingTop: '60px' }}>
              <Head>
                  <title>{subjectInfos.name ? `${subjectInfos.name}-` : null }有象视频-热点视频在线观看</title>
                  <meta name='keywords' content={this.setKeyword()} />
                  <meta name='description' content={this.setDesc()} />
                  <link rel='shortcut icon' href='/static/image/logo.png'/>
              </Head>
              <SubVideosCss />
              <Header
                  hidexIndex = {false}
                  headStyle={{ height: 60 }}
              />
              <section className={classNames['subject']}>
                  <div className={classNames['subject-content']}>
                      <div className={cn(classNames['subject-list'], 'clearfix')}>
                          <div className={classNames['item-wrap']}>
                              <Teleplay
                                  keyword={subjectInfos.name}
                                  name={subjectInfos.name}
                                  bizType={bizType}
                                  director={subjectInfos.director}
                                  year={subjectInfos.yearLabelName && subjectInfos.yearLabelName.join(' / ') || '-'}
                                  area={subjectInfos.areaLabelName && subjectInfos.areaLabelName.join(' / ') || '-'}
                                  realType={subjectInfos.typeLabelName && subjectInfos.typeLabelName.join(' / ')}
                                  actor={subjectInfos.actor.replace(/、/g, ' / ')}
                                  intro={subjectInfos.intro}
                                  clarity={subjectInfos.extMap.clarity}
                                  sign={subjectInfos.extMap.sign}
                                  updateEpisode={subjectInfos.extMap.updateEpisode}
                                  images={subjectInfos.images}
                                  categories={subjectInfos.categories}
                                  videoBaseId={subjectInfos.videoBaseId}
                              />
                          </div>
                      </div>
                      {
                          subjectInfos.bizType && subjectInfos.bizType === 1
                              ? <TvSeries
                                  workList={subjectInfos.vVideoDetailRspVos}
                                  pageSize = {48}
                              />
                              : <Variety
                                  workList={subjectInfos.vVideoDetailRspVos}
                                  pageSize={15}
                              />
                      }
                  </div>
                  <div style={{ width: '1180px', margin: '20px auto' }}>
                      <AboutRecommend
                          videoBaseId={videoBaseId}
                          limit={6}
                      />
                  </div>
              </section>
              <Footer/>
              <ToTop/>
          </div>
      );
  }
}

export default Subject;
