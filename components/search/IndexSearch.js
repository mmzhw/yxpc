import React, { Component } from 'react';
import classNames from './indexSearch.css';
import cn from 'classnames';
import storage from '../../utils/storage';
import api from '../../constants/api';
import fetch from '../../utils/fetch';
import debounce from '../../utils/debounce.js';

const MODULE = {
    NAME: '热门搜索',
    SEARCH: '搜索',
    HISTORY_NAME: '历史记录',
    CLEAR_HISTORY: '清除记录',
};

class IndexSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tipboxShow: false, // 显示搜索下拉框
            keyword: '', // 搜索关键词
            searchHistory: [], // 不能直接从storage取，因为window对象这里还取不到
        };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.getSlicedHots = this.getSlicedHots.bind(this);
        this.docClickEvent = this.docClickEvent.bind(this);
        this.onSearchBtnClicked = this.onSearchBtnClicked.bind(this);
        this.hots = [];
        this.randomVideo = {};
        this.fetchSearchHot({
            pageSize: 10,
        });
    }

    componentDidMount() {
        let self = this;
        this.timer = setTimeout(() => {
            self.refreshSearchHistory();
        }, 1000);
        document.addEventListener('click', this.docClickEvent);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        document.removeEventListener('click', this.docClickEvent);
    }

    docClickEvent(event) {
        let tagName = event.target.tagName;
        if (tagName === 'INPUT' || tagName === 'I') {
            return;
        }
        this.setState({
            tipboxShow: false
        });
    }

    onFocus() {
        this.randomVideo.videoName = '';
        this.setState({
            tipboxShow: true,
        });
    }

    onBlur() {
        this.tipboxTo = setTimeout(() => {
            this.getRandHotName();
            this.setState({
                tipboxShow: false
            });
        }, 200);
    }

    onKeyDown(event) {
        const code = event.keyCode;
        if (code === 13) { // 回车
            if (!this.state.keyword || this.state.keyword.trim() === '') { // 没有输关键字
                this.toNewWindow(this.state.randomVideo.videoName);
            } else {
                this.toNewWindow(this.state.keyword);
            }
        }
    }
    onChange(event) {
        event.persist();
        debounce(() => {
            let keyword = event.target.value;
            console.log('keyword', keyword);
            this.setState({
                keyword,
            });
        }, 200)();
    }

    clearHistory() {
        storage.set('searchHistory', []);
        this.setState({
            searchHistory: []
        });
    }

    toNewWindow(keyword) {
        this.addToHistory(keyword);
        this.refreshSearchHistory();
        window.open(`/search/${keyword}`, '_blank');
    }

    refreshSearchHistory() {
        this.setState({
            searchHistory: storage.get('searchHistory') ? storage.get('searchHistory').reverse().splice(0, 6) : []
        });
    }

    addToHistory(query) {
        const q = query.trim();
        const searchHistory = storage.get('searchHistory') || [];
        const index = searchHistory.indexOf(q);

        if (index === -1) {
            if (searchHistory.length < 6) {
                searchHistory.push(q);
            } else {
                searchHistory.shift();
                searchHistory.push(q);
            }
        } else {
            searchHistory.splice(index, 1);
            searchHistory.push(q);
        }

        storage.set('searchHistory', searchHistory);
    }

    onSearchBtnClicked() {
        if (!this.state.keyword || this.state.keyword.trim() === '') { // 没有输关键字
            this.toNewWindow(this.randomVideo.videoName);
        } else {
            this.toNewWindow(this.state.keyword);
        }
    }

    onKeyDown(event) {
        const code = event.keyCode;
        if (code === 13) { // 回车
            if (!this.state.keyword || this.state.keyword.trim() === '') { // 没有输关键字
                this.toNewWindow(this.randomVideo.videoName);
            } else {
                this.toNewWindow(this.state.keyword);
            }
        }
    }

    keywordsEmpty() {
        return !this.state.keyword && this.state.keyword.trim() === '';
    }

    getSlicedHots() {
        const list = [];
        if (this.hots.length === 0) {
            return list;
        }
        let index = 0;
        while (list.length < (10 - this.state.searchHistory.length)) {
            list.push(this.hots[index]);
            index++;
        }

        return list;
    }

    handleHistoryItemClick(value, event) {
        if (event.target.tagName === 'I') { // bubble up
            this.removeHistory(value);
            return;
        }
        this.toNewWindow(value);
    }

    removeHistory(history) {
        let searchHistory = storage.get('searchHistory');
        searchHistory.splice(searchHistory.indexOf(history), 1);
        storage.set('searchHistory', searchHistory);
        clearTimeout(this.tipboxTo);
        this.setState({
            searchHistory,
        });
    }

    getRandHotName() {
        const length = this.hots.length;
        const random = Math.floor(Math.random() * length);
        const hot = this.hots[random];

        if (hot !== undefined && hot !== null) {
            this.randomVideo = {
                videoName: hot.videoName || '',
            };
        }
    }

    async fetchSearchHot(params) {
        let res = await fetch(api.searchHot, params);
        if (res.code === 0) {
            this.hots = res.data || [];
            this.getRandHotName();
        }
    }

    render() {
        return (
            <div>
                <div className={classNames['searchWrapper']}>
                    <div className={classNames['leftInput']}>
                        <input
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            onKeyDown={this.onKeyDown}
                            onChange={this.onChange}
                            placeholder={this.randomVideo.videoName}
                        />
                        {
                            this.state.tipboxShow ? (<div className={classNames['tipboxShow']} style={{ zIndex: 20 }}>
                                {
                                    this.state.searchHistory && this.state.searchHistory.length > 0 &&
                                    (<div className={classNames['historyWrap']}>
                                        <h3>{MODULE.HISTORY_NAME}</h3>
                                        <div className={classNames['clearIcon']}>
                                            <i/>
                                            <span onClick={this.clearHistory.bind(this)}>{MODULE.CLEAR_HISTORY}</span>
                                        </div>
                                        <div className={classNames['clear']}></div>
                                        <ul>
                                            {this.state.searchHistory.map((history, index) => {
                                                return (
                                                    <li key={index}
                                                        onClick={this.handleHistoryItemClick.bind(this, history)}>
                                                        <span>{(history && history.length > 10) ? history.slice(0, 10) + '...' : history}</span>
                                                        {/* <i className={cn(classNames['close-icon'], 'iconfont icon-close')}></i>*/}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>)
                                }
                                <div className={classNames['hotList']}>
                                    <h2>{MODULE.NAME}</h2>
                                    <ul>
                                        {
                                            this.getSlicedHots() && this.getSlicedHots().length > 0 && this.getSlicedHots().map((hot, index) => {
                                                return (
                                                    <li key={index}
                                                        onClick={this.toNewWindow.bind(this, hot.videoName)}>
                                                        <i>{index + 1}</i>
                                                        <span>{hot.videoName}</span>
                                                        <div className={classNames['clear']}></div>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>) : null
                        }
                    </div>
                    <div className={classNames['rightClick']} onClick={this.onSearchBtnClicked}>
                        <img src={'../../static/image/search/nav_icon_sear_defa.png'}/>
                        <span>{MODULE.SEARCH}</span>
                        <div className={classNames['clear']}></div>
                    </div>
                    <div className={classNames['clear']}></div>
                </div>
            </div>
        );
    }
}

export default IndexSearch;
