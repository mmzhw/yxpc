import React, { Component } from 'react';
import Header from '../components/Header';
import Head from 'next/head';
import Item from '../components/search/Item.js';
import Item2 from '../components/search/Item2.js';
import Pagination from '../components/search/pagination.js';
import Footer from '../components/Footer';
import classNames from './search.css';
import fetch from '../utils/fetch.js';
import api from '../constants/api.js';
import cn from 'classnames';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPage: 0,
            videoList: [], // 长视频列表
            shortVideoList: [], // 短视频列表
            dataLoaded: false,
            records: 0, // 搜到的结果数
            pageNo: 1,
        };
        this.pageSize = 12;
    }
    componentDidMount() {
        this.fetchSearchResult({
            word: this.props.url.query.q || '',
            pageSize: this.pageSize,
            currentPage: 1
        });
    }
    goToPage(pageNo) {
        this.fetchSearchResult({
            word: this.props.url.query.q || '',
            pageSize: this.pageSize,
            currentPage: pageNo
        });
    }
    videoListEmpty() {
        return !this.state.videoList || this.state.videoList.length === 0;
    }
    shortVideoListEmpty() {
        return !this.state.shortVideoList || this.state.shortVideoList.length === 0;
    }
    render() {
        return (
            <div style={{ paddingTop: '60px' }}>
                <Head>
                    <title>{`${this.props.url.query.q}-片库-有象视频-热点视频在线`}</title>
                    <meta name='keywords' content='有象视频官网, 有象, 有象视频, 视频, 视频网站, 电影, 综艺, 少儿, 电视剧, 直播, 高清视频, 在线观看' />
                    <meta name='description' content='有象视频，是金诚集团旗下杭州大象网络文化集团重点推出的综合性视频平台。依托于集团多年来在文化产业板块的深耕与布局，有象视频将自制、引入并聚合电影、电视剧、动漫、综艺、明星演唱会、竞技赛事、VR体验、在线直播等优质内容，打造一个“无广告、零插播、高清畅快”的全民VIP视频文化平台。' />
                    <link rel='shortcut icon' href='/static/image/logo.png'/>
                </Head>
                <Header
                    hidexIndex = {false}
                    headStyle={{ height: 60 }}
                />
                <section className={classNames['search']}>
                    <div className={classNames['search-content']}>
                        <p className={classNames['message']}>搜索到 <span className={classNames['keyword']}>{ this.state.records }</span> 条 与 "<span className={classNames['keyword']}>{ this.props.url.query.q }</span>" 相关的内容</p>
                        {
                            !this.videoListEmpty() && (
                                <ul className={cn(classNames['video-list'], 'clearfix')}>
                                    {
                                        this.state.videoList.map((video, index) => {
                                            return (
                                                <li className={classNames['item-wrap']} key={index}>
                                                    <Item
                                                        keyword={this.props.url.query.q}
                                                        videoBaseId={video.videoBaseId}
                                                        clarity={video.extMap.clarity}
                                                        sign={video.extMap.sign}
                                                        updateEpisode={video.extMap.updateEpisode}
                                                        name={video.name}
                                                        intro={video.intro}
                                                        year={video.yearLabelName}
                                                        type={video.typeLabelName}
                                                        realType={video.realTypeLabelName && video.realTypeLabelName.join('/')}
                                                        director={video.director}
                                                        actor={video.actor}
                                                        area={video.areaLabelName && video.areaLabelName.join('/') || '-'}
                                                        detailCardVos={video.detailCardVos}
                                                        images={video.images}
                                                        categories={video.categories}
                                                        bizType={video.bizType}
                                                    />
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            )
                        }
                        {
                            !this.shortVideoListEmpty() && (
                                <ul className={cn(classNames['shortvideo-list'], 'clearfix')}>
                                    {
                                        this.state.shortVideoList.map((shortVideo, index) => {
                                            return <li className={classNames['item2-wrap']} key={index}>
                                                <Item2
                                                    videoBaseId={shortVideo.videoBaseId}
                                                    name={shortVideo.name}
                                                    clarity={shortVideo.extMap && shortVideo.extMap.clarity}
                                                    sign={shortVideo.extMap && shortVideo.extMap.sign}
                                                    subName={shortVideo.subName}
                                                    images={shortVideo.images}
                                                    duration={shortVideo.duration}
                                                />
                                            </li>;
                                        })
                                    }
                                </ul>
                            )
                        }
                        {
                            !this.shortVideoListEmpty() && (
                                <section className={classNames['page-wrap']}>
                                    <Pagination
                                        totalPage={this.state.totalPage}
                                        currentPage={this.state.pageNo}
                                        onPageChange={this.goToPage.bind(this)}
                                    />
                                </section>
                            )
                        }
                        {
                            this.videoListEmpty() && this.shortVideoListEmpty() && this.state.dataLoaded && (
                                <div className={classNames['no-search-results-wrap']}>
                                    <img src='/static/image/search/no-search-results.png' />
                                    <p className={classNames['no-results-msg']}>好像什么都没有QAQ...换个词儿试试？</p>
                                </div>)
                        }
                    </div>
                </section>
                <Footer/>
            </div>
        );
    }
    async fetchSearchResult(params) {
        let res = await fetch(api.searchResult, params);
        if (res.code === 0) {
            let remaining = res.data.records % this.pageSize;
            this.setState({
                videoList: res.data.videos,
                shortVideoList: res.data.shortVideos,
                records: res.data.records,
                pageNo: res.data.pageNo,
                totalPage: remaining > 0 ? Math.ceil(res.data.records / this.pageSize) : Math.floor(res.data.records / this.pageSize),
                dataLoaded: true
            });
        } else {
        }
    }
}

export default Search;
