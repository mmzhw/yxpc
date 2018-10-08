import React, { Component } from 'react';
import Header from '../components/Header';
import Player from '../components/player/Player.js';
import Panel from '../components/panel/Panel.js';
import Footer from '../components/Footer';
import Head from 'next/head';
import Link from 'next/link';
import GuessYourLike from '../components/Channel/GuessYourLike';
import AboutRecommend from '../components/Channel/AboutRecommend';
import Advertise from '../components/Advertises';
import classNames from './play.css';
import fetcher from '../utils/fetch.js';
import storage from '../utils/storage';
import { handleImgUrl } from '../utils/handleUrl';
import api from '../constants/api.js';
import ToTop from '../components/toTop';
import { videoPrefix } from '../utils/url';
import SubVideosCss from '../components/HomePage/SubVideos/SubVideosCss';
import Error from 'next/error';

const m3u8Parser = require('m3u8-parser');

class Play extends Component {
    static getInitialProps = async (props) => {
        const videoRes = await fetcher(api.videoInfo, {
            videoBaseId: props.query.baseId,
            videoDetailId: props.query.detailId
        });
        const videoInfos = videoRes.data;
        fetcher(api.videoAddHot, {
            videoBaseId: props.query.baseId,
            searchFlag: props.query.from === 'search' ? 1 : 0
        });
        return {
            errorCode: videoRes.code,
            videoRes,
            videoInfos,
        };
    }

    componentWillReceiveProps(props) {
        this.initVideoData(props);
        this.setState({
            isFold: false,
            tempFoldVal: false,
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            videoBaseUrl: videoPrefix,
            showMore: false,
            isFold: false, // 是否折叠
            hasSlider: false, // 是否需要右边侧栏
            isPanelFullDisplay: false, // 是否全屏
            isPanelCollapsed: true, // 全屏是否折叠
            tempFoldVal: false, // 全屏时需要存一个是否折叠的临时变量
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
                width: 1180,
            },
            videoExists: true, // 默认视频存在
            hlsPlayList: [],
            advertises: []
        };
        this.videoIntroChange = this.videoIntroChange.bind(this);
        this.foldPanel = this.foldPanel.bind(this);
        this.goToNextVideo = this.goToNextVideo.bind(this);
        this.enterFull = this.enterFull.bind(this);
        this.exitFull = this.exitFull.bind(this);
        this.changeFullPanel = this.changeFullPanel.bind(this);
        this.setHTMLKeyword = this.setHTMLKeyword.bind(this);
        this.setHTMLDesc = this.setHTMLDesc.bind(this);
    }

    async initVideoData(props) {
        this.fetchVideoInfo(props);
        const advertises = await this.getAdvertises();
        this.setState({
            advertises
        });
    }

    componentDidMount() {
        this.initVideoData(this.props);
    }

    getVideoSources(data) {
        const ua = require('../utils/ua.js');
        let sources = [];

        function compareResolutions(a, b) {
            if (!a.res || !b.res) {
                return 0;
            }
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
                sources.push({
                    res: mp4Sources[i]['clarity'],
                    type: 'video/mp4',
                    src: this.state.videoBaseUrl + mp4Sources[i]['url'],
                    label: resMap[mp4Sources[i]['clarity']]
                });
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
        fetch(this.state.videoBaseUrl + data.vVideoDetailRspVos[currentIndex].videoResourceStatusVo.m3u8Clarity.url, {}).then((res) => {
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

    async fetchVideoInfo(props) {
        const ua = require('../utils/ua.js');
        // let res = await fetcher(api.videoInfo, params)
        let res = props.videoRes;
        let hasSlider = false;
        if (res.code === 0) {
            const videoOption = { ...this.state.videoOption, sources: this.getVideoSources(res.data) };
            if (res.data.categories === 2) {
                videoOption.width = 880;
                hasSlider = true;
            } else {
                videoOption.width = 1180;
                hasSlider = false;
            }

            if (!ua.default.ie10) this.parseHlsList(res.data);

            this.setState({
                hasSlider,
                videoOption
            });
        } else if (res.code === 30003) { // 视频不存在
            this.setState({
                videoExists: false
            });
        }
    }

    foldPanel() {
        if (this.state.isFold) {
            const videoOption = { ...this.state.videoOption, width: 880 };
            this.setState({
                videoOption,
                isFold: false,
                // tempFoldVal: false,
            });
        } else {
            const videoOption = { ...this.state.videoOption, width: 1180 };
            this.setState({
                videoOption,
                isFold: true,
                // tempFoldVal: true,
            });
        }
    }

    goToNextVideo(videoId, videoDetailId, idxInVideoList) {
        storage.remove('watchedList');
        location.href = '/play/' + videoId + '/' + videoDetailId;
    }

    videoIntroChange() {
        this.setState({
            showMore: !this.state.showMore
        });
    }

    enterFull() {
        this.setState({
            isPanelFullDisplay: true,
            tempFoldVal: this.state.isFold,
            isFold: false,
        });
    }

    exitFull() {
        this.setState({
            isPanelFullDisplay: false,
            isFold: this.state.tempFoldVal,
        });
    }

    changeFullPanel() {
        this.setState({
            isPanelCollapsed: !this.state.isPanelCollapsed,
        });
    }

    async getAdvertises() {
        let advertises = [];
        for (let i = 1; i < 3; i++) {
            const advertise = await this.fetchAdvertise('01' + i);
            advertises.push(advertise);
        }
        return advertises;
    }

    async fetchAdvertise(adid) {
        const res = await fetcher('/web/ad/detail/v1', { adid });
        return res.data;
    }

    // 转换视频类型文字
    transVideoType(categories, bizType) {
        return categories === 1 ? (bizType === 0 ? '电影' : '视频') : (bizType === 1 ? '电视剧' : '综艺');
    }

    setVideoTitle(videoInfos) {
        if (videoInfos.bizType === 1) {
            return (
                <p>
                    <Link
                        as={`/subject/${videoInfos.videoBaseId}`}><a>{videoInfos.name}</a></Link> 第{videoInfos.vVideoDetailRspVos[videoInfos.currentIndex].episodeDisplay}集
                </p>
            );
        } else if (videoInfos.bizType === 2) {
            return (
                <p>
                    <Link as={`/subject/${videoInfos.videoBaseId}`}>
                        <a>{videoInfos.name}</a>
                    </Link>
                    {videoInfos.vVideoDetailRspVos[videoInfos.currentIndex].episodeDisplay}
                </p>
            );
        } else {
            return `${videoInfos.name} `;
        }
    }

    setHTMLKeyword() {
        let vinfo = this.props.videoInfos;
        if (vinfo.categories === 2) {
            if (vinfo.bizType === 1) {
                return `${vinfo.name}, ${vinfo.name}第${vinfo.vVideoDetailRspVos[vinfo.currentIndex].episodeDisplay}集, 在线播放, 有象视频, 电视剧, 高清视频在线观看`;
            } else {
                return `${vinfo.name}, ${vinfo.vVideoDetailRspVos[vinfo.currentIndex].episodeDisplay}期, 在线播放, 有象视频，高清视频在线观看`;
            }
        } else {
            return `${vinfo.name}, ${vinfo.name}在线播放, 有象视频, 高清视频在线观看`;
        }
    }

    setHTMLDesc() {
        let vinfo = this.props.videoInfos;
        if (vinfo.categories === 2) {
            if (vinfo.bizType === 1) {
                return `${vinfo.name}, ${vinfo.name}第${vinfo.vVideoDetailRspVos[vinfo.currentIndex].episodeDisplay}集, 有象视频电视剧, 高清电视剧在线观看, 剧情简介：${vinfo.vVideoDetailRspVos[vinfo.currentIndex].intro}`;
            } else {
                return `${vinfo.name}, ${vinfo.vVideoDetailRspVos[vinfo.currentIndex].episodeDisplay}集, 在线播放, 有象视频, 高清视频在线观看, ${vinfo.vVideoDetailRspVos[vinfo.currentIndex].intro}`;
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

        const { advertises } = this.state;
        return (
            <div style={{ paddingTop: '60px' }}>
                <Head>
                    <title>{this.props.videoInfos.name ? `${this.props.videoInfos.name}-` : null}有象视频-热点视频在线观看</title>
                    <meta name='keywords' content={this.setHTMLKeyword()}/>
                    <meta name='description' content={this.setHTMLDesc()}/>
                </Head>
                <SubVideosCss/>
                <Header
                    hidexIndex={false}
                    headStyle={{ height: 60 }}
                />
                <div className={classNames['play-wrap']}>
                    <div className={classNames['play-box']}>
                        <Player
                            option={this.state.videoOption}
                            videoInfo={this.props.videoInfos}
                            videoExists={this.state.videoExists}
                            hlsPlayList={this.state.hlsPlayList}
                            goToNextVideo={this.goToNextVideo}
                            enterFull={this.enterFull}
                            exitFull={this.exitFull}
                            changeFullPanel={this.changeFullPanel}
                            fullHeaderTitle={this.props.videoInfos.name}
                        />
                        {
                            this.state.hasSlider
                                ? (
                                    <Panel
                                        videoInfo={this.props.videoInfos}
                                        hasSlider={this.state.hasSlider}
                                        foldPanel={this.foldPanel}
                                        isFold={this.state.isFold}
                                        goToVideo={this.goToNextVideo}
                                        isPanelFullDisplay={this.state.isPanelFullDisplay}
                                        isPanelCollapsed={this.state.isPanelCollapsed}
                                    />
                                ) : null
                        }

                    </div>
                </div>
                <div className={classNames['video-info']}>
                    <div className={classNames['video-title']}>
                        {
                            this.props.videoInfos.name ? this.setVideoTitle(this.props.videoInfos) : null
                        }
                        <ul className={classNames['video-tag']}>
                            {
                                this.props.videoInfos.typeList && this.props.videoInfos.typeList.length !== 0 ? this.props.videoInfos.typeList.map((item) => {
                                    return <li key={item.id}>{item.name}</li>;
                                }) : null
                            }
                        </ul>
                    </div>
                    {
                        this.props.videoInfos.intro ? <div className={classNames['video-intro']}>
                            {this.props.videoInfos.intro.length > 150 && !this.state.showMore ? `简介：${this.props.videoInfos.intro.slice(0, 150)}` + '...' : `简介：${this.props.videoInfos.intro}`}
                            <span
                                onClick={this.videoIntroChange}>{this.props.videoInfos.intro.length > 150 ? this.state.showMore ? '收起' : '展开' : ''}</span>
                        </div> : null
                    }
                </div>
                <div style={{ width: '1180px', margin: '0 auto' }}>
                    <AboutRecommend
                        videoBaseId={this.props.url.query.baseId}
                        limit={6}
                    />
                    {
                        advertises && advertises[0] &&
                        <div style={{ marginTop: '21px', boxShadow: '0 0 6px 0 #EDEDED' }}>
                            <Advertise
                                url={advertises[0].contentUrl}
                                src={handleImgUrl(advertises[0].imageUrl)}
                            />
                        </div>
                    }
                    <GuessYourLike
                        videoBaseId={this.props.url.query.baseId}
                        limit={6}
                    />
                    {
                        advertises && advertises[1] &&
                        <div style={{ marginTop: '20px', boxShadow: '0 0 6px 0 #EDEDED' }}>
                            <Advertise
                                url={advertises[1].contentUrl}
                                src={handleImgUrl(advertises[1].imageUrl)}
                            />
                        </div>
                    }
                </div>
                <ToTop/>
                <div style={{ width: '100%', height: '20px' }}/>
                <Footer/>
            </div>
        );
    }
}

export default Play;
