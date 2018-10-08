import React, { Component } from 'react';
import classNames from './player.css';
import storage from '../../utils/storage';

let AMOUNT = []; // 代表人数个数位数，配合修改this.state.people
const NUM = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // 代表数字

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            interested: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            watching: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            watched: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            interestedN: 0,
            watchingN: 0,
            watchedN: 0,
            liveStatus: null,
        };
    }
    componentWillReceiveProps(props) {
        let interested = this.handleNumToArr(props.interested, this.state.interested);
        let watching = this.handleNumToArr(props.watching, this.state.watching);
        let watched = this.handleNumToArr(props.watched, this.state.watched);
        this.setState({
            interested: interested,
            watching: watching,
            watched: watched,
            interestedN: String(props.interested).length,
            watchingN: String(props.watching).length,
            watchedN: String(props.watched).length,
            liveStatus: props.liveStatus,
        });

        if (this.player) {
            if (this.props.option.sources[0].src !== props.option.sources[0].src) {
                this.player.reset();
                this.player.poster(props.option.poster);
                const ua = require('../../utils/ua.js');
                // this.buildFullHeader(props.fullHeaderTitle)
                // this.player.addChild('FullHeader')
                // this.player.getChild('FullHeader').el().querySelector('.vjs-full-header-title').innerText = props.fullHeaderTitle
                if (ua.default.ie10) {
                    this.player.reset();
                    this.player.src(props.option.sources);
                    // FIXME 变量名改
                    // let storeHlsMap = this.getMP4Index(props.option.sources)
                    // setTimeout(() => {
                    //   this.player.currentResolution(storeHlsMap)
                    // }, 0)
                } else {
                    if (!props.option.sources[0].src) {
                        return;
                    }
                    this.player.src(props.option.sources);
                }
            } else if (!props.option.sources[0].src) {
                this.player.poster(props.option.poster);
            }
        }

        if (!this.player) this.initPlayer(props);
    }

    handleNumToArr(num, oldNum) {
        let arr = String(num).split('');
        // if (arr.length < oldNum.length) {
        //   let diff = oldNum.length - arr.length;
        //   for (let i = 0; i < diff; i++) {
        //     arr.splice(0, 0, 0);
        //   }
        // }
        // if (arr.length === oldNum.length) {
        //   this.setState({
        //     people: arr
        //   });
        // }
        return arr;
    }
    // componentDidMount() {
    //   this.initPlayer()
    // }

    // 自定义加载界面
    buildLoadingSpinner() {
        const videojs = window.videojs;
        let loadingComponent = videojs.getComponent('LoadingSpinner');
        let Loading = videojs.extend(loadingComponent, {
            constructor: function(player, options) {
                loadingComponent.apply(this, arguments);
            },
            createEl() {
                return videojs.dom.createEl('div', {
                    innerHTML: `
            <div class="content-wrap">
              <img class="loading-gif" src="/static/image/play/player-loading.gif" alt="">
              <span class="loading-text">正在加载...</span>
            </div>
          `,
                    className: 'vjs-fullscreen-modal vjs-elephant-loading vjs-hidden'
                });
            },
        });
        videojs.registerComponent('Loading', Loading);
    }

    // 自定义错误界面
    buildErrorModal(componentName, imgPath, text) {
        const videojs = window.videojs;
        let self = this;
        let modal = videojs.getComponent('ClickableComponent');
        let theComponent = videojs.extend(modal, {
            name() {
                return componentName;
            },
            constructor: function(player, options) {
                modal.apply(this, arguments);
            },
            createEl() {
                return videojs.dom.createEl('div', {
                    innerHTML: `
            <div class="content-wrap" style="cursor: pointer;">
              <img src="${imgPath}" alt="">
              <span class="error-text">${text}</span>
              <span class="error-reload-btn">刷新试试</span>
            </div>
          `,
                    className: 'vjs-fullscreen-modal vjs-hidden'
                });
            },
            handleClick() {
                self.player.reset();
                self.player.src(self.props.option.sources);
            }
        });
        videojs.registerComponent(componentName, theComponent);
    }

    // 自定义flash未安装界面
    buildFlashErrorModal(componentName, imgPath, text) {
        const videojs = window.videojs;
        let modal = videojs.getComponent('ClickableComponent');
        let theComponent = videojs.extend(modal, {
            name() {
                return componentName;
            },
            constructor: function (player, options) {
                modal.apply(this, arguments);
            },
            createEl() {
                return videojs.createEl('div', {
                    innerHTML: `
            <div class="content-wrap" style="cursor: pointer;">
              <img src="${imgPath}" alt="">
              <span class="error-text">${text}</span>
              <span class="error-reload-btn">立即安装</span>
            </div>
          `,
                    className: 'vjs-fullscreen-modal vjs-hidden'
                });
            },
            handleClick() {
                location.href = 'http://get.adobe.com/cn/flashplayer/';
            }
        });
        videojs.registerComponent(componentName, theComponent);
    }

    // 自定义完成播放页面
    buildCompModal(componentName, imgPath, text, txtClass) {
        let textClass = 'comp-text';
        if (txtClass) {
            textClass = 'none-text';
        }
        let self = this;
        const videojs = window.videojs;
        let modal = videojs.getComponent('ClickableComponent');
        let theComponent = videojs.extend(modal, {
            name() {
                return componentName;
            },
            constructor: function(player, options) {
                modal.apply(this, arguments);
            },
            createEl() {
                return videojs.dom.createEl('div', {
                    innerHTML: `
            <div class="content-wrap">
              <img src="${imgPath}" alt="">
              <span class="${textClass}">${text}</span>
            </div>
          `,
                    className: 'vjs-fullscreen-modal vjs-hidden'
                });
            },
            handleClick() {
                if (!txtClass) {
                    self.player.play();
                }
            }
        });
        videojs.registerComponent(componentName, theComponent);
    }

    // 鼠标hover提示框
    buildTooltip() {
        const videojs = window.videojs;
        let component = videojs.getComponent('Component');
        let tooltip = videojs.extend(component, {
            createEl() {
                return videojs.dom.createEl('span', {
                    className: 'elephant-tooltip vjs-hidden'
                });
            },
        });
        videojs.registerComponent('Tooltip', tooltip);
    }

    // 清晰度切换提示界面
    buildResChange(text) {
        const videojs = window.videojs;
        let modal = videojs.getComponent('Component');
        let theComponent = videojs.extend(modal, {
            constructor: function(player, options) {
                modal.apply(this, arguments);
            },
            createEl() {
                return videojs.dom.createEl('div', {
                    innerHTML: `
            <span>正在切换清晰度，请稍后...</span>
          `,
                    className: 'vjs-res-change vjs-hidden'
                });
            },
        });
        videojs.registerComponent('ResChangeTip', theComponent);
    }

    // 全屏头部模块
    buildFullHeader() {
        const videojs = window.videojs;
        let modal = videojs.getComponent('Component');
        let theComponent = videojs.extend(modal, {
            constructor: function(player, options) {
                modal.apply(this, arguments);
            },
            createEl() {
                return videojs.dom.createEl('div', {
                    innerHTML: `
                        <span class='vjs-full-header-title'></span>
                        <span class='vjs-full-header-time' style="float: left;text-align: left;padding-left:10px"></span>
                      `,
                    className: 'vjs-full-header vjs-hidden'
                });
            },
        });
        videojs.registerComponent('FullHeader', theComponent);
    }
    compareResolutions(a, b) {
        if (!a.res || !b.res) { return 0; }
        return (+(b.res)) - (+(a.res));
    }
    getMP4Index(mp4SourcesList) {
        return mp4SourcesList[0].res;
    }
    getHlsIndex(hlsSourcesList) {
        let index = 0;
        if (storage.get('markedHlsLevel')) {
            let markedHlsLevel = storage.get('markedHlsLevel');
            hlsSourcesList.forEach(function(item, idx) {
                if (item.res === markedHlsLevel) {
                    index = idx;
                }
            });
        }
        return index;
    }
    currentDetail() {
        if (!this.props.videoInfo.vVideoDetailRspVos) return;
        return this.props.videoInfo.vVideoDetailRspVos[this.props.videoInfo.currentIndex];
    }

    fixNum(num) {
        if (num > 9) {
            return num;
        }
        return '0' + num;
    }

    initPlayer(props) {
        this.player = null;
        const theComponent = this;
        const videojs = window.videojs;
        const ua = require('../../utils/ua.js');
        let controlBar = {
            children: [
                'playToggle',
                'NextButton',
                'currentTimeDisplay',
                'timeDivider',
                'durationDisplay',
                'progressControl',
                'keepTooltipsInside',
                'fullscreenToggle',
                'volumeControl',
                'muteToggle',
                'xuanjiButton'
            ],
            progressControl: {
                keepTooltipsInside: true
            }
        };
        const videoJsOptions = {
            autoplay: props.option.autoplay || true,
            controls: props.option.controls || true,
            width: props.option.width || 1170,
            height: props.option.height || 658,
            loop: props.option.loop || true,
            poster: props.option.poster || '',
            controlBar,
            sources: props.option.sources || [],
            techOrder: ['html5', 'flash'],
            flash: { hls: { withCredentials: false }},
            html5: {
                hls: { withCredentials: false },
                hlsjsConfig: {
                    debug: true
                }
            },
            errorDisplay: false, // 使用自定义错误框
            loadingSpinner: false, // 使用自定义加载框
        };
        this.player = videojs(this.refs.videoNode, videoJsOptions, function onPlayerReady() {
            this.volume(0.8);

            // 如果是电影/小视频  就隐藏NextButton, xuanjiButton
            if (props.videoInfo.categories === 1) {
                this.controlBar.getChild('xuanjiButton').hide();
            }

            // 自定义加载
            theComponent.buildLoadingSpinner();
            const LoadingUI = this.addChild('Loading');
            // 自定义错误
            theComponent.buildErrorModal('YXErrorDisplay', '/static/image/play/player-error.png', '加载失败啦QAQ');
            const YXErrorDisplayUI = this.addChild('YXErrorDisplay');
            // 自定义flash未安装界面
            theComponent.buildFlashErrorModal('YXFlashErrorDisplay', '/static/image/play/player-error.png', '您的浏览器未安装Flash插件，请下载安装');
            const YXFlashErrorDisplayUI = this.addChild('YXFlashErrorDisplay');
            if (!props.option.flash) {
                YXFlashErrorDisplayUI.show();
                return;
            }
            // 自定义完成展示
            theComponent.buildCompModal('YXFinish', '/static/image/play/player-finish.png', '重新播放');
            const YXFinishUI = this.addChild('YXFinish');
            if (!props.videoExists) {
                // 自定义下架视频提示
                theComponent.buildCompModal('YXNone', '/static/image/play/player-error.png', '该视频已下架~', 'none-text');
                const YXNoneUI = this.addChild('YXNone');
                this.bigPlayButton.hide();
                YXNoneUI.show();
                return;
            }
            // 自定义切换清晰度提示
            theComponent.buildResChange();
            const ResChangeTipUI = this.addChild('ResChangeTip');
            // 自定义控制条提示框
            theComponent.buildTooltip();
            const TooltipUI = this.controlBar.addChild('Tooltip');
            // 自定义全屏后的头部
            theComponent.buildFullHeader();
            const FullHeaderUI = this.addChild('FullHeader');
            // 显示当前时间，每3秒更新一次
            if (!this.setCurrTime) {
                this.setCurrTime = setInterval(() => {
                    const currTime = new Date();
                    this.getChild('FullHeader').el().querySelector('.vjs-full-header-time').innerText = `${theComponent.fixNum(currTime.getHours())}:${theComponent.fixNum(currTime.getMinutes())}`;
                }, 3000);
            }

            this.on('error', () => {
                YXErrorDisplayUI.show();
                LoadingUI.hide();
            });

            this.on('loadeddata', () => {
                YXErrorDisplayUI.hide();
                // this.childNameIndex_.Loading.el_.removeAttribute('style')
            });

            // if (ua.default.ie10) {
            // } else {
            //   setTimeout(() => {
            //     const videoBaseUrl = videoPrefix
            //     let sourcesList = theComponent.currentDetail().videoResourceStatusVo.m3u8Clarity.claritys
            //     let levels = theComponent.props.hlsPlayList
            //     if (levels.length > 0) {
            //       let hlsSourcesList = []
            //       for (let i = 0, j = sourcesList.length; i < j; i++) {
            //         hlsSourcesList.push({ src: videoBaseUrl + levels[i].uri, type: 'application/x-mpegURL', res: sourcesList[i].slice(0, -1) })
            //       }
            //       // sort hlsSourcesList
            //       hlsSourcesList = hlsSourcesList.sort(theComponent.compareResolutions)
            //       let index = theComponent.getHlsIndex(hlsSourcesList)

            //       let tempSrc = []
            //       tempSrc.push(hlsSourcesList[index])
            //       this.src(tempSrc)
            //     }
            //   }, 0)
            // }

            this.on('loadedmetadata', () => {
                LoadingUI.hide();
                // if (ua.default.ie10) {
                // } else {
                //   let repLabelMap = {
                //     '240P': '流畅',
                //     '480P': '标清',
                //     '720P': '高清',
                //     '1080P': '1080P',
                //   }
                //   const videoBaseUrl = videoPrefix
                //   let sourcesList = theComponent.currentDetail().videoResourceStatusVo.m3u8Clarity.claritys
                //   let levels = theComponent.props.hlsPlayList
                //   if (levels.length > 0) {
                //     let hlsSourcesList = []
                //     for (let i = 0, j = sourcesList.length; i < j; i++) {
                //       hlsSourcesList.push({ url: videoBaseUrl + levels[i].uri, label: repLabelMap[sourcesList[i]], type: 'application/x-mpegURL', res: sourcesList[i].slice(0, -1) })
                //     }
                //     // sort hlsSourcesList
                //     hlsSourcesList = hlsSourcesList.sort(theComponent.compareResolutions)
                //     let index = theComponent.getHlsIndex(hlsSourcesList)
                //     this.updateHlsSrc(hlsSourcesList, index)
                //   }
                // }
            });

            const loadingHideList = ['playing', 'canplay', 'ready'];
            for (let i = 0, j = loadingHideList.length; i < j; i++) {
                this.on(loadingHideList[i], () => {
                    LoadingUI.hide();
                });
            }
            this.on('seeked', () => {
                // if (this.paused()) {
                //   this.controlBar.playToggle.handlePause()
                // }
                LoadingUI.hide();
                YXFinishUI.hide();
            });
            this.on('waiting', () => {
                YXFinishUI.hide();
                // if (this.currentTime() >= this.bufferedEnd()) { // IE上不起作用？
                LoadingUI.show();
                // }
            });
            this.on('ended', () => {
                YXFinishUI.show();
            });

            // 全屏事件
            this.on('fullscreenchange', (screen) => {
                if (this.isFullscreen()) {
                    ResChangeTipUI.addClass('fullscreen');
                    this.addClass('vjs-elephant-fullscreen');
                    FullHeaderUI.show();
                } else {
                    ResChangeTipUI.removeClass('fullscreen');
                    this.removeClass('vjs-elephant-fullscreen');
                    FullHeaderUI.hide();
                }

                // 去掉button相关的title
                const hoverButtons = ['playToggle', 'muteToggle'];
                for (let i = 0, j = hoverButtons; i < j; i++) {
                    this.controlBar[i].el().removeAttribute('title');
                }
            });

            // 切换清晰度事件
            this.on('resolutionchange', () => {
                ResChangeTipUI.show();
            });
            this.on('reschangeFinish', (event, label) => {
                ResChangeTipUI.hide();
            });

            // 各个按钮的hover
            const hoverButtons = { 'playToggle': '', 'NextButton': '下一集', 'muteToggle': '静音', 'fullscreenToggle': '全屏' };
            let tipTimer = null;
            for (let key in hoverButtons) {
                if (!this.controlBar.getChild(key)) continue;
                this.controlBar.getChild(key).el().addEventListener('mouseover', (e) => {
                    this.controlBar.getChild(key).el().removeAttribute('title');
                    const leftWidth = this.controlBar.getChild(key).el().offsetLeft;
                    let text = hoverButtons[key];
                    if (this.controlBar.getChild(key).name() === 'PlayToggle') {
                        if (this.controlBar.getChild(key).hasClass('vjs-paused')) {
                            text = '点击播放';
                        } else {
                            text = '点击暂停';
                        }
                    }
                    if (this.controlBar.getChild(key).name() === 'FullscreenToggle') {
                        if (this.isFullscreen()) {
                            text = '退出全屏';
                        } else {
                            text = '全屏';
                        }
                    }

                    tipTimer = setTimeout(() => {
                        TooltipUI.el().innerHTML = text;
                        TooltipUI.el().style.left = leftWidth + 'px';
                        TooltipUI.show();
                    }, 500);

                    // tipTimer = setTimeout(() => {
                    //   TooltipUI.innerHTML = text
                    //   if (this.controlBar[key].name_ === 'FullscreenToggle') {
                    //     if (this.isFullscreen()) {
                    //       TooltipUI.style.left = (leftWidth - 20) + 'px'
                    //     } else {
                    //       TooltipUI.style.left = leftWidth + 'px'
                    //     }
                    //   } else {
                    //     TooltipUI.style.left = leftWidth + 'px'
                    //   }
                    //   TooltipUI.style.display = 'block'
                    // }, 500)
                    // theComponent.hideToolTip()
                });
                this.controlBar.getChild(key).el().addEventListener('mouseleave', (e) => {
                    clearTimeout(tipTimer);
                    TooltipUI.hide();
                });
            }
            // this.hotkeys({
            //   enableModifiersForNumbers: false,
            //   enableVolumeScroll: false,
            //   alwaysCaptureHotkeys: true, // Forces the capture of hotkeys
            // })
        });
    // if (!ua.default.ie10) {
    //   this.player.videoJsHlsSwitcher({
    //     dynamicLabel: true
    //   })
    // } else { // mp4
    //   this.player.videoJsResolutionSwitcher({
    //     default: 'high',
    //     dynamicLabel: true
    //   })
    // }
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
        }
        if (this.player.setCurrTime) {
            clearInterval(this.player.setCurrTime);
        }
    }

    render() {
        let mt;
        let mtNum;
        if (this.state.liveStatus === 1) {
            mt = this.state.interested;
            mtNum = this.state.interestedN; // 數字位數
        } else if (this.state.liveStatus === 2) {
            mt = this.state.watched;
            mtNum = this.state.watchedN;
        } else if (this.state.liveStatus === 0) {
            mt = this.state.watching;
            mtNum = this.state.watchingN;
        }
        AMOUNT = [];
        for (let i = 0; i < mtNum; i++) {
            AMOUNT.push(i);
        }

        let interested;
        let watching;
        let watched;
        if (mt && mt.length >= 0) {
            let numHtml = (<div className={classNames['activity-time']}>
                {
                    AMOUNT && AMOUNT.map((item, index) => {
                        return (
                            <ul key={index} style={{ marginTop: -mt[index] * 40 + 'px' }}>
                                {
                                    NUM && NUM.map((item, numIndex) => {
                                        return (<li key={numIndex}>{item}</li>);
                                    })
                                }
                            </ul>
                        );
                    })}
            </div>);
            interested = (<div>{numHtml}<span>人想看</span></div>);
            watching = (<div className={classNames['watching']}>
                <img src={'/static/image/about/watching.png'} />
                {numHtml}
                <span className={classNames['watching-t']}> 人在观看</span>
            </div>);
            watched = (<div className={classNames['watching']}>
                {numHtml}
                <span className={classNames['watching-t']}>人观看过</span>
            </div>);
        }

        let appearHtml = null;
        if (this.state.liveStatus === 1) {
            appearHtml = interested;
        } else if (this.state.liveStatus === 2) {
            appearHtml = watched;
        } else if (this.state.liveStatus === 0) {
            appearHtml = watching;
        }

        return (
            <div>
                <div data-vjs-player className={classNames['player-wrap']}>
                    <div className={classNames['want-see']}>{appearHtml}</div>
                    <video ref={'videoNode'} className={'video-js vjs-no-flex vjs-elephant'}></video>
                </div>
            </div>
        );
    }
}

export default Player;
