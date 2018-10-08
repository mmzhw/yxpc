import Header from '../components/Header.js';
import React, { Component } from 'react';
import Head from 'next/head';
import classNames from './yearSubject.css';
import ToTop from '../components/toTop';
import fetcher from '../utils/fetch';
import { handleImgUrl } from '../utils/handleUrl';
import { videoPrefix } from '../utils/url';
import Player from '../components/player/Player.js';
import Error from 'next/error';

const m3u8Parser = require('m3u8-parser');

const REQUEST_URL = {
    LIST: '/web/special/channel/lists',
    VIDEO_INFO: '/web/videoBase/videoBaseInfo',
};

class Activity extends Component {
    // next 初始化元素，数据来自url
    static getInitialProps = async (props) => {
        const channelRes = await fetcher(REQUEST_URL.LIST, { id: props.query.activityId });
        const channelInfos = channelRes.data;
        return {
            errorCode: channelRes.code,
            channelRes,
            channelInfos,
        };
    };

    constructor(props) {
        super(props);
        let models = (props.channelInfos && props.channelInfos.models instanceof Array) ? props.channelInfos.models.filter((model) => {
            return model.cardType === 2;
        }) : [];
        this.state = {
            subjectState: 1, // 专题状态，1、点开始页面；2、列表页面；3、具体数据视频页面
            currentCard: 0, // 当前卡片
            models: models, // 右边具体卡片内容
            leftDisplay: true,
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
            videoExists: true,
            videoBaseUrl: videoPrefix,
            hlsPlayList: [],
        };
        this.videoRes = null;
    }

    async getVideoInfo(index) {
        let cards = this.state.models[this.state.currentCard].mdata.videos;
        let videoBaseId = cards[index].videoId;
        if (!videoBaseId) {
            return;
        }
        let videoRes = await fetcher(REQUEST_URL.VIDEO_INFO, { videoBaseId });
        if (videoRes.code === 0) {
            this.fetchVideoInfo(videoRes.data);
        } else if (videoRes.code === 30003) { // 视频不存在
            this.setState({
                subjectState: 3,
                videoExists: false
            });
        }
    }

    // 专题状态，1、点开始页面；2、列表页面；3、具体数据视频页面
    controlIndex(index) {
        this.setState({ subjectState: index });
    }

    // 获取右边具体数据列表
    changeCard(index) {
        this.setState({ currentCard: index });
        this.backToTop();
    }

    // 获取视频具体信息
    fetchVideoInfo(videoInfos) {
        const ua = require('../utils/ua.js');
        const videoOption = { ...this.state.videoOption, sources: this.getVideoSources(videoInfos) };
        if (videoInfos.categories === 2) {
            videoOption.width = 840;
        } else {
            videoOption.width = 1180;
        }
        if (!ua.default.ie10) this.parseHlsList(videoInfos);

        this.setState({
            videoOption: videoOption,
            videoInfos: videoInfos,
            subjectState: 3
        });
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

            let parsedManifest = parser.manifest;
            if (parsedManifest.playlists) {
                this.setState({
                    hlsPlayList: parsedManifest.playlists
                });
            }
        });
    }

    formatDate(scheduleTime) {
        let time = new Date(scheduleTime);
        let month = time.getMonth() + 1;
        let date = time.getDate();
        return month + '月' + date + '日';
    }

    controllLeft() {
        this.setState({
            leftDisplay: !this.state.leftDisplay,
        });
    }

    backToTop() {
        document.body.scrollTop = 0; // For Chrome, Safari and Opera
        document.documentElement.scrollTop = 0; // For IE and Firefox
    }

    render() {
        // 请求错误处理
        if (this.props.errorCode !== 0) {
            return (<Error statusCode={this.props.errorCode} />);
        }
        const { channelInfo = {}} = this.props.channelInfos || { };

        let cards = (this.state.models[this.state.currentCard] && this.state.models[this.state.currentCard].mdata) ? this.state.models[this.state.currentCard].mdata.videos : [];

        let activity_top = {
            background: `url(${handleImgUrl(channelInfo.headImgPc)}) center, #fff`,
            backgroundSize: '100% auto',
            zIndex: '16',
            top: this.state.subjectState === 1 ? '0' : '-100%',
            backgroundRepeat: 'repeat-y',
        };

        let videoWrapper = {
            marginTop: '-270px',
            marginLeft: -(this.state.videoOption.width / 2) + 'px',
        };

        return (
            <div className={classNames['yearWrapper']}>
                <Head><title key='yearSubject'>{channelInfo.name}</title></Head>
                <div className={classNames['activityIndex']} style={ activity_top }>
                    <div onClick={this.controlIndex.bind(this, 2)}></div>
                </div>
                {this.state.subjectState !== 1 ? (<div className={classNames['activity-content']}>
                    <div className={classNames['activity-left']} style={{ left: this.state.leftDisplay ? '0' : '-280px' }}>
                        <ul>
                            {this.state.models.map((model, index) => {
                                return (
                                    <li key={model.id} onClick={this.changeCard.bind(this, index)} className={this.state.currentCard === index ? classNames['currentFont'] : ''}>
                                        <p>{model.cardName.split('：')[0]}</p>
                                        <p>{model.cardName.split('：')[1]}</p>
                                    </li>
                                );
                            })}
                        </ul>
                        <div onClick={this.controllLeft.bind(this)}><i>{this.state.leftDisplay ? '<<' : '>>'}</i></div>
                    </div>
                    <div className={classNames['activity-right']} style={{ width: this.state.leftDisplay ? 'calc(100% - 280px)' : '100%' }}>
                        <div className={classNames['headWrapper']}>
                            <Header
                                hidexIndex = {false}
                                headStyle={{ height: 60 }}
                                wrapperStyle={{ position: 'relative' }}
                            />
                        </div>
                        <img src={`${handleImgUrl(this.state.models[this.state.currentCard].imageBannerUrl)}`}/>
                        <ul>
                            {
                                cards.map((item, index) => {
                                    let lineAppear = (cards.length === 1 || index !== (cards.length - 1)) ? 'block' : 'none';
                                    let circular;
                                    let mask;
                                    let center;
                                    if (index === 0) {
                                        circular = 'TCircular';
                                        mask = 'TMask';
                                    } else if (index === (cards.length - 1)) {
                                        if (index % 2 === 0) {
                                            circular = 'BLCircular';
                                            mask = 'BLMask';
                                        } else {
                                            circular = 'BRCircular';
                                            mask = 'BRMask';
                                        }
                                    } else {
                                        if (index % 2 === 0) {
                                            circular = 'CLCircular';
                                        } else {
                                            circular = 'CRCircular';
                                        }
                                    }
                                    if (index % 2 === 0) {
                                        center = true;
                                    } else {
                                        center = false;
                                    }
                                    return (
                                        <li key={index}>
                                            <div className={classNames['leftLine']} style={{ display: lineAppear }}></div>
                                            <div className={classNames[circular]} onClick={this.getVideoInfo.bind(this, index)}>

                                                {mask ? <div className={classNames[mask]}></div> : null}
                                                <i>
                                                    <img src={handleImgUrl(item.imageUrl)}/>
                                                </i>
                                                <i className={classNames['timeI']} style={{ zIndex: '7' }}>
                                                    <div
                                                        className={classNames['timeWrapper']}>{this.formatDate(item.scheduleTime)}</div>
                                                </i>
                                                {
                                                    item.videoId
                                                        ? <div className={classNames['startPlay']} style={{ zIndex: '6' }}><i></i>
                                                        </div> : null
                                                }
                                            </div>
                                            <div className={classNames['text']}>
                                                <h3 style={{ textAlign: center ? 'left' : 'right' }}>{item.name}</h3>
                                                <p>{item.subName}</p>
                                            </div>
                                            <div className={classNames['clear']}></div>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                    <div className={classNames['clear']}></div>
                </div>) : null}
                {
                    this.state.subjectState === 3 ? (
                        <div className={classNames['videoWrapper']}>
                            <div style={videoWrapper}>
                                <Player
                                    option={this.state.videoOption}
                                    cancelState={this.controlIndex.bind(this, 2)}
                                    videoInfo={this.state.videoInfos}
                                    videoExists={this.state.videoExists}
                                    hlsPlayList={this.state.hlsPlayList}
                                    fullHeaderTitle={this.state.videoInfos ? this.state.videoInfos.name : null}
                                ></Player>
                            </div>
                        </div>
                    ) : null
                }

                <ToTop/>
                <script dangerouslySetInnerHTML={{
                    __html: `var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?947e6edc453c6772f1377d9d3b335c29";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();`
                }}/>
                <script
                    dangerouslySetInnerHTML={{ __html: ` var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1271658313'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s19.cnzz.com/z_stat.php%3Fid%3D1271658313' type='text/javascript'%3E%3C/script%3E"));document.getElementById('cnzz_stat_icon_1271658313').style.display='none';` }}/>

            </div>
        );
    }
}

export default Activity;
