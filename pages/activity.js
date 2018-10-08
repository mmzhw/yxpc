import React, { Component } from 'react';
import Header from '../components/Header';
import Error from 'next/error';
import Head from 'next/head';
import LivePlayer from '../components/livePlayer/Player.js';
import classNames from './activity.css';
import fetcher from '../utils/fetch';
import Advertise from '../components/AdvertiseLive';
import SubVideosCss from '../components/HomePage/SubVideos/SubVideosCss';
import VideosTepl8 from '../components/HomePage/VideosTepl/VideosTepl8';
import VideosTepl7 from '../components/HomePage/VideosTepl/VideosTepl7';
import VideosTepl9 from '../components/HomePage/VideosTepl/VideosTepl9';
import Footer from '../components/Footer';
import ToTop from '../components/toTop';
import { handleImgUrl } from '../utils/handleUrl';
import { videoPrefix } from '../utils/url';
import cn from 'classnames';
import { flashChecker } from '../utils/checkFlash';
const m3u8Parser = require('m3u8-parser');
const TIME_INTERVAL = 60000;
const CLOCK_INTERVAL = 1000;
class Activity extends Component {
  static getInitialProps = async (props) => {
      const channelRes = await fetcher('/web/special/channel/lists', { id: props.query.activityId });
      const channelInfos = channelRes.data || {};
      return {
          errorCode: channelRes.code,
          channelRes,
          channelInfos,
      };
  }
  constructor(props) {
      super(props);
      this.state = {
          videoBaseUrl: videoPrefix,
          videoInfos: {
              name: '',
              intro: '',
              currentIndex: 0,
              vVideoDetailRspVos: [{
                  episodeDisplay: '',
              }],
              typeList: [],
          },
          videoOption: {
              sources: [{
                  src: '',
              }],
              controls: true,
              width: 1170,
              loop: true,
              poster: '',
              flash: true,
          },
          videoExists: true,
          currLiveRoom: 0,
          liveStatus: null, // 直播状态，0:正在直播，1:直播前，2:直播结束
          playbackStatus: 1,
          countTimeText: '0天 00:00:00',
          isLive: true,
          showMore: false,
          isHeartChange: false, // 是否根据心跳包改变过状态
          isInterested: false, // 是否点击过想看
          liveRoomId: 0,
          interested: 0,
          watching: 0,
          imageBannerUrl: ''
      };
      this.changeLiveRoom = this.changeLiveRoom.bind(this);
      this.videoIntroChange = this.videoIntroChange.bind(this);
  }
  componentDidMount() {
      this.handleVideoInfo(this.props);
  }

  handleVideoInfo(props) {
      // const ua = require('../utils/ua.js')
      if (this.liveTimer) {
          clearInterval(this.liveTimer);
      }
      let res = props.channelRes;
      if (res.code === 0) {
          let source = [{}];
          if (res.data.models[0].mdata.length >= 0) {
              // res.data.models[0].mdata[0].liveRoomI = l2509974338634752;
              this.liveRoomId = res.data.models[0].mdata[0].liveRoomId;
          }
          let liveStatus = null;

          res.data.models.forEach((item) => {
              if (item.cardType === 1) {
                  if (this.state.isHeartChange) {
                      item.mdata[this.state.currLiveRoom].liveRoomStatus = this.state.liveStatus;
                  }
                  if (item.mdata[this.state.currLiveRoom].liveRoomStatus === 1) {
                      this.fetchWarmUpVideo(item.mdata[this.state.currLiveRoom].liveRoomId, item.mdata[this.state.currLiveRoom].imgUrl);
                      this.timer = setInterval(() => {
                          if (item.mdata[this.state.currLiveRoom].scheduleTime <= Date.now()) {
                              this.setState({
                                  countTimeText: '0天 00 : 00 : 00'
                              });
                              clearInterval(this.timer);
                          }
                          this.timeCountDown(item.mdata[this.state.currLiveRoom].scheduleTime);
                      }, CLOCK_INTERVAL);
                      liveStatus = 1;
                      let liveRoomId = item.mdata[this.state.currLiveRoom].liveRoomId;
                      this.intervalStatus(item.mdata[this.state.currLiveRoom].liveRoomId, item.mdata[this.state.currLiveRoom].hlsPlayUrl, item.mdata[this.state.currLiveRoom].imgUrl);
                      fetcher('/m_web/liveRoom/view', { liveRoomId }).then((res) => {
                          console.log('add watching');
                      });
                  } else if (item.mdata[this.state.currLiveRoom].liveRoomStatus === 0) {
                      source = [{
                          src: item.mdata[this.state.currLiveRoom].hlsPlayUrl,
                          type: 'application/x-mpegURL',
                      }];
                      let liveRoomId = item.mdata[this.state.currLiveRoom].liveRoomId;
                      this.intervalStatus(item.mdata[this.state.currLiveRoom].liveRoomId, item.mdata[this.state.currLiveRoom].hlsPlayUrl, item.mdata[this.state.currLiveRoom].imgUrl);
                      fetcher('/m_web/liveRoom/view', { liveRoomId }).then((res) => {
                          console.log('add watching');
                      });
                  } else {
                      let liveRoomId = item.mdata[this.state.currLiveRoom].liveRoomId;
                      this.state.playbackStatus = item.mdata[this.state.currLiveRoom].playbackStatus;
                      fetcher('/m_web/liveRoom/view', { liveRoomId }).then((res) => {
                          console.log('add watched');
                      });
                      this.intervalStatus(liveRoomId, item.mdata[this.state.currLiveRoom].playbackUrl);
                      liveStatus = 2;
                      // 根据是否开启回放播放视频
                      if (item.mdata[this.state.currLiveRoom].playbackStatus && item.mdata[this.state.currLiveRoom].playbackUrl) {
                          source = [{
                              src: item.mdata[this.state.currLiveRoom].playbackUrl,
                              type: 'application/x-mpegURL',
                          }];
                      } else {
                          this.fetchWarmUpVideo(item.mdata[this.state.currLiveRoom].liveRoomId, item.mdata[this.state.currLiveRoom].imgUrl);
                      }
                  }
                  const ua = require('../utils/ua.js');
                  let flash = true;
                  if (ua.default.ie11) {
                      const fls = flashChecker();
                      if (!fls.f) {
                          flash = false;
                      }
                  }
                  let url = handleImgUrl(this.state.currLiveRoom === 0 ? item.imageBannerUrl : item.mdata[this.state.currLiveRoom].imgUrl);
                  if (this.props.channelInfos.channelInfo.id === 100010) {
                      url = '../static/image/pc.jpg';
                  }
                  const videoOption = { ...this.state.videoOption, sources: source, flash: flash, poster: url };
                  // if (!ua.default.ie10) this.parseHlsList(res.data)
                  this.setState({
                      videoOption,
                      liveStatus,
                      isHeartChange: false,
                      imageBannerUrl: item.imageBannerUrl
                  });
                  return;
              } else if (item.cardType === 2 && item.layoutId === 1) {
                  source = [{
                      src: videoPrefix + item.mdata.videos[0].videoResourceStatusVo.m3u8Clarity.url,
                      type: 'application/x-mpegURL',
                  }];
                  const ua = require('../utils/ua.js');
                  let flash = true;
                  if (ua.default.ie11) {
                      const fls = flashChecker();
                      if (!fls.f) {
                          flash = false;
                      }
                  }
                  let url = handleImgUrl(item.imageBannerUrl);
                  if (this.props.channelInfos.channelInfo.id === 100010) {
                      url = '../static/image/pc.jpg';
                  }
                  const videoOption = { ...this.state.videoOption, sources: source, flash: flash, poster: url };
                  // if (!ua.default.ie10) this.parseHlsList(res.data)
                  this.setState({
                      videoOption,
                      isLive: false,
                  });
                  return;
              }
          });
      } else if (res.code === 30003) { // 视频不存在
          this.setState({
              videoExists: false
          });
      }
  }
  async fetchWarmUpVideo(liveRoomId, imgUrl) {
      const warmUp = await fetcher('/m_web/liveRoom/warmUpVideoList', { liveRoomId });
      const warmUpRes = warmUp.data;
      const ua = require('../utils/ua.js');
      let flash = true;
      if (ua.default.ie11) {
          const fls = flashChecker();
          if (!fls.f) {
              flash = false;
          }
      }
      this.state.currLiveRoom === 0 && (imgUrl = this.state.imageBannerUrl);
      let url = handleImgUrl(imgUrl);
      if (this.props.channelInfos.channelInfo.id === 100010) {
          url = '../static/image/pc.jpg';
      }
      if (warmUpRes.length > 0) {
          const source = [{
              src: videoPrefix + warmUpRes[0].vVideoDetailRspVos[0].videoResourceStatusVo.m3u8Clarity.url,
              type: 'application/x-mpegURL',
          }];
          // let warmUpImg = ''
          // warmUpRes[0].images.forEach((item) => {
          //   if (item.scale === 1) {
          //     warmUpImg = item.url
          //   }
          // })
          const videoOption = { ...this.state.videoOption, sources: source, flash: flash, poster: url };
          this.setState({
              videoOption
          });
      } else {
          const source = [{}];
          const videoOption = { ...this.state.videoOption, sources: source, flash: flash, poster: url };
          this.setState({
              videoOption
          });
      }
  }
  getVideoSources(data) {
      const ua = require('../utils/ua.js');
      let sources = [];
      function compareResolutions(a, b) {
          if (!a.res || !b.res) { return 0; }
          return (+(b.res).slice(0, -1)) - (+(a.res).slice(0, -1));
      }
      const resMap = {
          '240P': '流畅',
          '480P': '标清',
          '720P': '高清',
          '1080P': '1080P',
      };
      let currentIndex = data.currentIndex;
      // 不兼容ie 10及以下走mp4
      if (ua.default.ie10) {
          const mp4Sources = data.vVideoDetailRspVos[currentIndex].videoResourceStatusVo.mp4Claritys;
          for (let i = 0, j = mp4Sources.length; i < j; i++) {
              sources.push({ res: mp4Sources[i]['clarity'], type: 'video/mp4', src: this.state.videoBaseUrl + mp4Sources[i]['url'], label: resMap[mp4Sources[i]['clarity']] });
          }
          sources = sources.sort(compareResolutions);
      } else {
          sources = [{
              src: this.state.videoBaseUrl + data.vVideoDetailRspVos[currentIndex].videoResourceStatusVo.m3u8Clarity.url,
              type: 'application/x-mpegURL',
          }];
      }
      return sources;
  }
  parseHlsList(data) {
      // FIXME 统一！
      let currentIndex = data.currentIndex;
      fetch(this.state.videoBaseUrl + data.vVideoDetailRspVos[currentIndex].videoResourceStatusVo.m3u8Clarity.url, {
      }).then((res) => {
          return res.text();
      }).then((res) => {
          const parser = new m3u8Parser.Parser();
          parser.push(res);
          parser.end();
          var parsedManifest = parser.manifest;
          if (parsedManifest.playlists) {
              this.setState({
                  hlsPlayList: parsedManifest.playlists
              });
          }
      });
  }
  changeLiveRoom(index) {
      this.setState({
          currLiveRoom: index,
      }, () => {
          this.handleVideoInfo(this.props);
      });
  }
  fixNum(num) {
      if (num > 9) {
          return num;
      } else {
          return '0' + num;
      }
  }
  timeCountDown(timestamp) {
      const timeDiff = timestamp - Date.now();
      let timeInfo = {};
      if (timeDiff <= 0) {
          timeInfo = {
              days: '0',
              hours: '00',
              mins: '00',
              secs: '00',
          };
      } else {
          const timeLeft = Math.floor(timeDiff / 1000);
          timeInfo = {
              days: Math.floor(timeLeft / 86400),
              hours: this.fixNum(Math.floor((timeLeft / 3600) % 24)),
              mins: this.fixNum(Math.floor((timeLeft / 60) % 60)),
              secs: this.fixNum(Math.floor(timeLeft % 60)),
          };
      }
      this.setState({
          countTimeText: `${timeInfo.days}天 ${timeInfo.hours}:${timeInfo.mins}:${timeInfo.secs}`
      });
  }
  startRequestInterval(liveRoomId, url, imgUrl) {
      fetcher('/m_web/liveRoom/getRecordByLiveRoomId', { liveRoomId }).then((res) => {
          if (res.code !== 0) {
              return;
          }
          this.setState({ interested: res.data.interested, watching: (res.data.watching + res.data.interested), watched: res.data.watched });
          if (res.data.liveStatus === this.state.liveStatus) {
              if (res.data.liveStatus === 2 && this.state.playbackStatus !== res.data.playbackStatus) {
                  if (res.data.playbackStatus) {
                      const videoOption = { ...this.state.videoOption, sources: [{ src: url, type: 'application/x-mpegURL' }], poster: handleImgUrl(imgUrl) };
                      this.setState({
                          videoOption
                      });
                  } else {
                      this.fetchWarmUpVideo(liveRoomId, imgUrl);
                  }
              }
              this.state.playbackStatus = res.data.playbackStatus;
              return;
          }
          if (res.data.liveStatus === 0) { // 直播
              const videoOption = { ...this.state.videoOption, sources: [{ src: url, type: 'application/x-mpegURL' }] };
              this.setState({
                  videoOption
              });
          } else if (res.data.liveStatus === 2) { // 回看
              this.state.playbackStatus = res.data.playbackStatus;
              if (res.data.playbackStatus) {
                  const videoOption = { ...this.state.videoOption, sources: [{ src: url, type: 'application/x-mpegURL' }], poster: handleImgUrl(imgUrl) };
                  this.setState({
                      videoOption
                  });
              } else {
                  this.fetchWarmUpVideo(liveRoomId, imgUrl);
              }
          } else if (res.data.liveStatus === 1) { // 预热
              this.fetchWarmUpVideo(liveRoomId, imgUrl);
          }
          this.setState({
              liveStatus: res.data.liveStatus,
              isHeartChange: true,
          });
      });
  }
  intervalStatus(liveRoomId, url, imgUrl) {
      console.log('liveRoomId', liveRoomId);
      let self = this;
      self.startRequestInterval(liveRoomId, url, imgUrl);
      this.liveTimer = setInterval(() => {
          self.startRequestInterval(liveRoomId, url, imgUrl);
      }, TIME_INTERVAL);
  }
  videoIntroChange() {
      this.setState({
          showMore: !this.state.showMore
      });
  }
  addInterseted() {
      if (!this.state.isInterested) {
          let liveRoomId = this.liveRoomId;
          fetcher('/m_web/liveRoom/view', { liveRoomId }).then((res) => {
              console.log('add interested');
          });
          this.setState({ isInterested: true });
      }
  }
  turnPlayback() {
      document.getElementById('vjs_video_3_html5_api').play();
  }
  handleBodyBg(type, content) {
      return type ? { background: content } : { backgroundImage: `url(${handleImgUrl(content)})` };
  }
  render() {
      // 请求错误处理
      if (this.props.errorCode !== 0) {
          return (<Error statusCode={this.props.errorCode} />);
      }

      const { channelInfo, models } = this.props.channelInfos;
      let bgclass = this.state.isInterested ? 'hearted' : 'heart';
      let wantClick = null;

      console.log('this.state.isLive', this.state.isLive);

      if (this.state.liveStatus === 0) {
          wantClick = null;
      } else if (this.state.liveStatus === 1) {
          wantClick = (
              <div className={classNames['interested-wraper']} onClick={this.addInterseted.bind(this)}>
                  <div className={classNames[bgclass]}/>
                  <span>我也想看</span>
              </div>);
      } else if (this.state.liveStatus === 2) {
          // wantClick = (
          //     <div className={classNames['interested-wraper']} onClick={this.turnPlayback.bind(this)}>
          //         <div className={classNames['back']}></div>
          //         <span>回看完整版</span>
          //     </div>);
          wantClick = null;
      }

      // let activity_top = {
      //     height: '920px',
      //     backgroundImage: `url(${handleImgUrl(channelInfo.headImgPc)})`
      // };
      // let activity_body = {
      //     // margin: '-507px auto 0',
      // };
      // if (channelInfo.id < 100010) {
      //     activity_top['height'] = '1150px';
      //     activity_body['margin'] = '-723px auto 0';
      // } else {
      //     activity_body['margin'] = '-723px auto 0';
      // }

      let headPadding = channelInfo ? (channelInfo.id < 100010 ? 427 : 200) : 200;

      let countTime = this.state.liveStatus === 1 ? 'block' : 'none';

      return (
          <div style={{ paddingTop: '60px' }}>
              <Head>
                  <title key='activity'>{ channelInfo.name }</title>
              </Head>
              <SubVideosCss />
              <Header
                  hidexIndex = {false}
                  headStyle={{ height: 60 }}
              />
              <div className={classNames['activity-body']} style={this.handleBodyBg(channelInfo.backType, channelInfo.backPc)}>
                  <div className={classNames['activity-headPic']} style={{ backgroundImage: `url(${handleImgUrl(channelInfo.headImgPc)})`, height: 723 + headPadding + 'px' }}/>
                  <div className={classNames['activity-wrap']} style={{ paddingTop: headPadding + 'px' }}>
                      {
                          models && models.map((item, index) => {
                              switch (item.cardType) {
                                  case 1:
                                      return (
                                          <div key={index} style={{ width: '1180px', margin: '0 auto 30px' }}>
                                              <div className={classNames['play-wrap']}>
                                                  <div className={classNames['play-countdown']} style={{ display: countTime }}>
                                                      <p>距离直播开始：</p>
                                                      {
                                                          this.state.liveStatus === 1 ? <p className={classNames['special-font']}>{this.state.countTimeText}</p> : null
                                                      }
                                                  </div>
                                                  {
                                                      item.mdata.length >= 2 ? <ul className={classNames['play-sources']}>
                                                          {
                                                              item.mdata.map((mdata, index) => {
                                                                  return <li className={cn(classNames['play-sources-li'], { [classNames['play-sources-li-active']]: this.state.currLiveRoom === index })} key={index} onClick={this.changeLiveRoom.bind(null, index)}>{mdata.name}</li>;
                                                              })
                                                          }
                                                      </ul> : null
                                                  }
                                                  <div className={classNames['player-wrap']}>
                                                      <LivePlayer
                                                          interested = {this.state.interested}
                                                          watching = {this.state.watching}
                                                          watched = {this.state.watched}
                                                          liveStatus = {this.state.liveStatus}
                                                          option={this.state.videoOption}
                                                          videoInfo={this.state.videoInfos}
                                                          videoExists={this.state.videoExists}
                                                      />
                                                  </div>
                                              </div>
                                              <div className={classNames['interested-bg']}>
                                                  {
                                                      item.mdata[this.state.currLiveRoom].liveDesc ? <div className={classNames['play-info-wrap']} style={{ width: this.state.liveStatus !== 1 ? '1140px' : '870px' }}>
                                                          {
                                                              item.mdata[this.state.currLiveRoom].liveDesc.length > 300 && !this.state.showMore
                                                                  ? <div dangerouslySetInnerHTML={{ __html: item.mdata[this.state.currLiveRoom].liveDesc.slice(0, 300) + '...' }}></div>
                                                                  : <div dangerouslySetInnerHTML={{ __html: item.mdata[this.state.currLiveRoom].liveDesc }}></div>
                                                          }
                                                          <span className={classNames['play-info-wrap-fold']} onClick={this.videoIntroChange}>{item.mdata[this.state.currLiveRoom].liveDesc.length > 300 ? this.state.showMore ? '收起' : '展开' : ''}</span>
                                                      </div> : null
                                                  }
                                                  {wantClick}
                                                  <div className={classNames['clear']}/>
                                              </div>

                                          </div>
                                      );
                                  case 2:
                                      switch (item.layoutId) {
                                          case 1:
                                              return (
                                                  <div key={index} style={{ width: '1180px', margin: '0 auto 30px' }}>
                                                      <div className={classNames['play-wrap']}>
                                                          <div className={classNames['player-wrap']}>
                                                              <LivePlayer
                                                                  option={this.state.videoOption}
                                                                  videoInfo={this.state.videoInfos}
                                                                  videoExists={this.state.videoExists}
                                                              />
                                                          </div>
                                                      </div>
                                                      {
                                                          item.mdata.videos[0].intro ? <div className={classNames['play-info-wrap']}>
                                                              <div dangerouslySetInnerHTML={{ __html: item.mdata.videos[0].intro }} style={{ height: item.mdata.videos[0].intro.length > 300 && !this.state.showMore ? '42px' : 'auto', overflow: 'hidden' }}/>
                                                              <span className={classNames['play-info-wrap-fold']} onClick={this.videoIntroChange}>{item.mdata.videos[0].intro.length > 300 ? this.state.showMore ? '收起' : '展开' : ''}</span>
                                                          </div> : null
                                                      }
                                                      <div className={classNames['clear']}/>
                                                  </div>
                                              );
                                          case 4:
                                              return (
                                                  <div key={index} style={{ overflow: 'auto' }}>
                                                      <VideosTepl8 selectClass cardsName={item.cardName} layoutId={4} cardsName2={item.cardName2} cards={item.mdata} model={item} key={item.id} />
                                                  </div>
                                              );
                                          case 7:
                                              return (
                                                  <div key={index} style={{ overflow: 'auto' }}>
                                                      <VideosTepl9 selectClass cardsName={item.cardName} layoutId={7} needkey={index} cards={item.mdata} model={item} key={item.id} />
                                                  </div>
                                              );
                                          default:
                                              return (
                                                  <div key={index} style={{ overflow: 'auto' }}>
                                                      <VideosTepl7 selectClass cardsName={item.cardName} layoutId={item.layoutId} needkey={index} cards={item.mdata} model={item} key={item.id} />
                                                  </div>
                                              );
                                      }
                                  case 3:
                                      return (
                                          <div style={{ margin: '20px auto 0', width: '1180px' }} key={index}>
                                              <Advertise adlayoutId={item.layoutId} allData={item.mdata}></Advertise>
                                          </div>
                                      );
                                  default: return;
                              }
                          })
                      }
                      <div className={classNames['foot']} style={{ paddingTop: channelInfo.footType === 0 ? '0' : '150px' }}>
                          {
                              channelInfo.footType === 0 && (
                                  <img src={handleImgUrl(channelInfo.footImgPc)} />
                              )
                          }
                      </div>
                  </div>
              </div>
              <ToTop />
              <Footer />
          </div>
      );
  }
}

export default Activity;
