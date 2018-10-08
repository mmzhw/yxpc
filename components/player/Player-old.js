import React, { Component } from 'react';
import Head from 'next/head';
import classNames from './player.css';
import storage from '../../utils/storage';
import throttle from '../../utils/throttle';
import { videoPrefix } from '../../utils/url';

class Player extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(props) {
        if (this.player) {
            // 改变视频宽度
            this.player.width(props.option.width);
            if (this.props.option.sources[0].src !== props.option.sources[0].src) {
                storage.remove('watchedList');
                const ua = require('../../utils/ua.js');
                // 如果是最后一集 隐藏下一集按钮
                if (!this.isNextBtnShow(props)) {
                    this.player.controlBar.removeChild('NextButton');
                } else if (!this.player.controlBar.getChild('NextButton')) {
                    this.registerNextButton();
                    this.player.controlBar.addChild('NextButton', {}, 1);
                }
                // 如果是多剧集 显示选集按钮
                if (props.videoInfo.categories === 1) {
                    this.player.controlBar.getChild('xuanjiButton').hide();
                } else {
                    this.player.controlBar.getChild('xuanjiButton').show();
                    this.player.on('fullscreenchange', (screen) => {
                        if (this.player.isFullscreen()) {
                            if (props.videoInfo.categories === 2) {
                                // 改变选集
                                this.changeXuanjiPanel();
                            }
                        } else {
                            if (props.videoInfo.categories === 2) {
                                // 恢复选集
                                this.restoreXuanjiPanel();
                            }
                        }
                    });
                    this.player.off('ended');
                    this.player.on('ended', () => {
                        if (!this.isNextBtnShow(props)) {
                            this.player.getChild('YXFinish').show();
                        } else {
                            this.goToNextVideo();
                        }
                    });
                }

                if (this.player && this.player.getChild('FullHeader')) {
                    this.player.getChild('FullHeader').el().querySelector('.vjs-full-header-title').innerText = props.fullHeaderTitle;
                }

                if (ua.default.ie10) {
                    this.player.reset();
                    if (this.player.updateSrc) {
                        this.player.updateSrc(props.option.sources);
                    }
                    // FIXME 变量名改
                    let storeHlsMap = this.getMP4Index(props.option.sources);
                    setTimeout(() => {
                        this.player.currentResolution(storeHlsMap);
                    }, 0);
                } else {
                    this.player.src(props.option.sources);
                }
            }
        } else {
            this.initPlayer(props);
        }
    }

    // 自定义加载界面
    buildLoadingSpinner() {
        const videojs = window.videojs;
        let loadingComponent = videojs.getComponent('LoadingSpinner');
        let Loading = videojs.extend(loadingComponent, {
            constructor: function (player, options) {
                loadingComponent.apply(this, arguments);
            },
            createEl() {
                return videojs.createEl('div', {
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
              <span class="error-reload-btn">刷新试试</span>
            </div>
          `,
                    className: 'vjs-fullscreen-modal vjs-hidden'
                });
            },
            handleClick() {
                location.reload();
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
            constructor: function (player, options) {
                modal.apply(this, arguments);
            },
            createEl() {
                return videojs.createEl('div', {
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
                    if (self.props.videoInfo.currentIndex === 0) {
                        self.player.play();
                    } else {
                        self.props.goToNextVideo(self.props.videoInfo.videoBaseId, self.props.videoInfo.vVideoDetailRspVos[0].videoDetailId, 0);
                    }
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
                return videojs.createEl('span', {
                    className: 'elephant-tooltip vjs-hidden'
                });
            },
        });
        videojs.registerComponent('Tooltip', tooltip);
    }

    registerNextButton() {
        const videojs = window.videojs;
        let VjsButton = videojs.getComponent('Button');
        let self = this;
        let NextButton = videojs.extend(VjsButton, {
            constructor: function () {
                VjsButton.apply(this, arguments);
            },
            handleClick: function () {
                self.goToNextVideo();
            },
            buildCSSClass: function () {
                return 'vjs-control vjs-button vjs-next iconfont icon-next_play';
            },
        });
        videojs.registerComponent('NextButton', NextButton);
    }

    // 清晰度切换提示界面
    buildResChange(text) {
        const videojs = window.videojs;
        let modal = videojs.getComponent('Component');
        let theComponent = videojs.extend(modal, {
            constructor: function (player, options) {
                modal.apply(this, arguments);
            },
            createEl() {
                return videojs.createEl('div', {
                    innerHTML: `<span>正在切换清晰度，请稍后...</span>`,
                    className: 'vjs-res-change vjs-hidden'
                });
            },
        });
        videojs.registerComponent('ResChangeTip', theComponent);
    }

    // 全屏头部模块
    buildFullHeader(text) {
        const videojs = window.videojs;
        let modal = videojs.getComponent('Component');
        let theComponent = videojs.extend(modal, {
            constructor: function (player, options) {
                modal.apply(this, arguments);
            },
            createEl() {
                return videojs.createEl('div', {
                    innerHTML: `<span class='vjs-full-header-title'>${text}</span><span class='vjs-full-header-time'></span>`,
                    className: 'vjs-full-header vjs-hidden'
                });
            },
        });
        videojs.registerComponent('FullHeader', theComponent);
    }

    // 选集按钮
    registerXuanjiButton() {
        const videojs = window.videojs;
        let VjsButton = videojs.getComponent('Button');
        let self = this;
        let xuanjiButton = videojs.extend(VjsButton, {
            constructor: function () {
                VjsButton.apply(this, arguments);
            },
            handleClick: function () {
                self.props.changeFullPanel();
            },
            buildCSSClass: function () {
                return 'vjs-control vjs-button vjs-xuanji iconfont icon-xuanji';
            },
        });
        videojs.registerComponent('xuanjiButton', xuanjiButton);
    }

    compareResolutions(a, b) {
        if (!a.res || !b.res) {
            return 0;
        }
        return (+(b.res)) - (+(a.res));
    }

    getMP4Index(mp4SourcesList) {
        if (storage.get('markedHlsLevel')) {
            let markedHlsLevel = storage.get('markedHlsLevel');
            return markedHlsLevel;
        } else {
            return mp4SourcesList[0].res;
        }
    }

    getHlsIndex(hlsSourcesList) {
        let index = 0;
        if (storage.get('markedHlsLevel')) {
            let markedHlsLevel = storage.get('markedHlsLevel');
            hlsSourcesList.forEach(function (item, idx) {
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

    // 下一集的index(如果是最后一集，nextIndex为0)
    nextVideoIndex() {
        let vInfo = this.props.videoInfo;
        let currentIndex = vInfo.currentIndex;
        let videoList = vInfo.vVideoDetailRspVos;
        let nextIndex = 0;
        nextIndex = currentIndex + 1 >= videoList.length ? 0 : currentIndex + 1;
        return nextIndex;
    }

    isNextBtnShow(data) {
        let vInfo = data.videoInfo;
        if (!vInfo.videoBaseId) return;
        let currentIndex = vInfo.currentIndex;
        let videoList = vInfo.vVideoDetailRspVos;

        let show = false;
        show = currentIndex + 1 < videoList.length;
        return show;
    }

    goToNextVideo() {
        let vInfo = this.props.videoInfo;
        let videoList = vInfo.vVideoDetailRspVos;
        let videoId = vInfo.videoBaseId;
        let videoDetailId = videoList[this.nextVideoIndex()].videoDetailId;

        this.props.goToNextVideo(videoId, videoDetailId, this.nextVideoIndex());
    }

    changeXuanjiPanel() {
        this.props.enterFull();
        this.player.el().appendChild(document.querySelector('.right-panel'));
        this.player.controlBar.xuanjiButton.removeClass('active');
    }

    restoreXuanjiPanel() {
        this.props.exitFull();
        let righPanelEle = this.player.el().querySelector('.right-panel');
        document.querySelector('.right-panel-wrap').appendChild(righPanelEle);
    }

    isEmpty(obj) {
        for (let prop in obj) {
            return false;
        }
        return true;
    }

    // 记录播放时间
    markWatching(time, props) {
        const watchedList = storage.get('watchedList') || {};
        watchedList[props.videoInfo.vVideoDetailRspVos[props.videoInfo.currentIndex].videoDetailId] = time;
        storage.set('watchedList', watchedList);
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
        require('./plugins/videojs-resolution-switcher');
        require('./plugins/videojs-resolution-switcher/hls-switcher');
        require('./plugins/videojs-hotkeys');
        if (this.isNextBtnShow(props)) {
            this.registerNextButton();
        }
        this.registerXuanjiButton();
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
            controls: true,
            width: props.option.width || 1180,
            height: props.option.height || 473,
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
        this.player = videojs(this.videoNode, videoJsOptions, function onPlayerReady() {
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
            // // 自定义完成展示
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
            theComponent.buildFullHeader(props.fullHeaderTitle);
            const FullHeaderUI = this.addChild('FullHeader');
            // 显示当前时间，每3秒更新一次
            if (!this.setCurrTime) {
                this.setCurrTime = setInterval(() => {
                    const currTime = new Date();
                    this.getChild('FullHeader').el().querySelector('.vjs-full-header-time').innerText = `${theComponent.fixNum(currTime.getHours())}:${theComponent.fixNum(currTime.getMinutes())}`;
                }, 3000);
            }

            this.on('error', () => {
                // FIXME 暂时没有找到直接获取的方法?
                YXErrorDisplayUI.show();
                LoadingUI.hide();
            });
            this.on('loadeddata', () => {
                YXErrorDisplayUI.hide();
            });
            const markWatchHistory = () => {
                const currentTime = this.currentTime();
                theComponent.markWatching(currentTime, props);
            };
            this.on('timeupdate', throttle(markWatchHistory, 3000));

            if (ua.default.ie10) {
            } else {
                setTimeout(() => {
                    const videoBaseUrl = videoPrefix;
                    let sourcesList = theComponent.currentDetail().videoResourceStatusVo.m3u8Clarity.claritys;
                    let levels = theComponent.props.hlsPlayList;
                    if (levels.length > 0) {
                        let hlsSourcesList = [];
                        for (let i = 0, j = sourcesList.length; i < j; i++) {
                            hlsSourcesList.push({
                                src: videoBaseUrl + levels[i].uri,
                                type: 'application/x-mpegURL',
                                res: sourcesList[i].slice(0, -1)
                            });
                        }
                        // sort hlsSourcesList
                        hlsSourcesList = hlsSourcesList.sort(theComponent.compareResolutions);
                        let index = theComponent.getHlsIndex(hlsSourcesList);
                        // console.log(hlsSourcesList)
                        let tempSrc = [];
                        tempSrc.push(hlsSourcesList[index]);
                        this.src(tempSrc);
                    }
                }, 0);
            }

            this.on('loadedmetadata', () => {
                LoadingUI.hide();
                const savedWatch = storage.get('watchedList');
                if (!theComponent.isEmpty(savedWatch) && savedWatch[props.videoInfo.vVideoDetailRspVos[props.videoInfo.currentIndex].videoDetailId]) {
                    let currentTime = savedWatch[props.videoInfo.vVideoDetailRspVos[props.videoInfo.currentIndex].videoDetailId];

                    this.currentTime(currentTime);
                }
                if (ua.default.ie10) {
                } else {
                    let repLabelMap = {
                        '240P': '流畅',
                        '480P': '标清',
                        '720P': '高清',
                        '1080P': '1080P',
                    };
                    const videoBaseUrl = videoPrefix;
                    let sourcesList = theComponent.currentDetail().videoResourceStatusVo.m3u8Clarity.claritys;
                    let levels = theComponent.props.hlsPlayList;
                    if (levels.length > 0) {
                        let hlsSourcesList = [];
                        for (let i = 0, j = sourcesList.length; i < j; i++) {
                            hlsSourcesList.push({
                                url: videoBaseUrl + levels[i].uri,
                                label: repLabelMap[sourcesList[i]],
                                type: 'application/x-mpegURL',
                                res: sourcesList[i].slice(0, -1)
                            });
                        }
                        // sort hlsSourcesList
                        hlsSourcesList = hlsSourcesList.sort(theComponent.compareResolutions);
                        let index = theComponent.getHlsIndex(hlsSourcesList);
                        if (this.updateHlsSrc) {
                            this.updateHlsSrc(hlsSourcesList, index);
                        }
                    }
                }
            });

            const loadingHideList = ['playing', 'canplay', 'ready'];
            for (let i = 0, j = loadingHideList.length; i < j; i++) {
                this.on(loadingHideList[i], () => {
                    LoadingUI.hide();
                });
            }
            this.on('seeked', () => {
                LoadingUI.hide();
                YXFinishUI.hide();
            });
            this.on('waiting', () => {
                YXFinishUI.hide();
                LoadingUI.show();
            });
            this.on('ended', () => {
                if (!theComponent.isNextBtnShow(props)) {
                    YXFinishUI.show();
                } else {
                    theComponent.goToNextVideo();
                }
            });

            // 全屏事件
            this.on('fullscreenchange', (screen) => {
                if (this.isFullscreen()) {
                    ResChangeTipUI.addClass('fullscreen');
                    this.addClass('vjs-elephant-fullscreen');
                    FullHeaderUI.show();
                    if (props.videoInfo.categories === 2) {
                        // 改变选集
                        theComponent.changeXuanjiPanel();
                    }
                } else {
                    ResChangeTipUI.removeClass('fullscreen');
                    this.removeClass('vjs-elephant-fullscreen');
                    FullHeaderUI.hide();
                    if (props.videoInfo.categories === 2) {
                        // 恢复选集
                        theComponent.restoreXuanjiPanel();
                    }
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
            const hoverButtons = {
                'playToggle': '',
                'NextButton': '下一集',
                'muteToggle': '静音',
                'fullscreenToggle': '全屏'
            };
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
                });
                this.controlBar.getChild(key).el().addEventListener('mouseleave', (e) => {
                    clearTimeout(tipTimer);
                    TooltipUI.hide();
                });
            }
            if (this.hotkeys) {
                this.hotkeys({
                    enableModifiersForNumbers: false,
                    enableVolumeScroll: false,
                    alwaysCaptureHotkeys: true, // Forces the capture of hotkeys
                });
            }

            if (theComponent && theComponent.player && theComponent.player.videoJsHlsSwitcher) {
                if (!ua.default.ie10) {
                    theComponent.player.videoJsHlsSwitcher({
                        dynamicLabel: true
                    });
                } else { // mp4
                    theComponent.player.videoJsResolutionSwitcher({
                        default: 'high',
                        dynamicLabel: true
                    });
                }
            }
        });
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
        }
        if (this.player && this.player.setCurrTime) {
            clearInterval(this.player.setCurrTime);
        }
    }

    render() {
        let cancelButton;
        if (this.props.cancelState) {
            cancelButton = (
                <div className={classNames['cancelButton']} onClick={this.props.cancelState}></div>
            );
        }

        return (
            <div>

                <div data-vjs-player className={classNames['player-wrap']}>
                    <video ref={node => this.videoNode = node} className={'video-js vjs-no-flex vjs-elephant'}></video>
                    {cancelButton}
                </div>
            </div>
        );
    }
}

export default Player;
