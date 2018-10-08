import React, { Component } from 'react';
import Header from '../components/Header';
import Head from 'next/head';
import Router from 'next/router';
import fetcher from '../utils/fetch.js';
import api from '../constants/api.js';
import getLinkProps from '../components/HomePage/VideosTepl/getLinkProps';
import { imgPrefix } from '../utils/url';
import ToTop from '../components/toTop';
import NoResult from '../components/screen/NoResult';
import Footer from '../components/Footer';
import Pagination from '../components/search/pagination.js';
import VideoItem from '../components/HomePage/SubVideos/VideoItem';
import SubVideoContent from '../components/HomePage/SubVideos/SubVideoContent';
import ScreenHeader from '../components/screen/ScreenHeader.js';
import { pageTitle } from '../utils';
import classNames from './screen.css';
import SubVideosCss from '../components/HomePage/SubVideos/SubVideosCss';

const title = '全部视频—热点视频-';
const keywords = '有象视频官网, 有象, 有象视频, 视频, 视频网站, 电影, 综艺, 少儿, 电视剧, 直播, 高清视频, 在线观看';
const description = '有象视频，是金诚集团旗下杭州大象网络文化集团重点推出的综合性视频平台。依托于集团多年来在文化产业板块的深耕与布局，有象视频将自制、引入并聚合电影、电视剧、动漫、综艺、明星演唱会、竞技赛事、VR体验、在线直播等优质内容，打造一个“无广告、零插播、高清畅快”的全民VIP视频文化平台。';

class Screen extends Component {
    state = {
        imgPrefix,
        conditions: [],
        videos: [],
        loading: true,
        totalItem: 0,
        pageSize: 42,
        currentPage: 1,
    }
    // 全部有效的分类列表
    fetchAllGroupLabels = async () => {
        try {
            const res = await fetcher(api.allGroupLabels, {});
            if (res.code === 0) {
                const result = res.data;
                return result;
            } else {
                // message.error(res.errmsg)
            }
        } catch (e) {
            // message.error(e.errmsg)
        }
    }
    // 按条件全量检索,只搜索大象平台的视频
    fetchSelectQuery = async (labels = '', pageSize = 42, currentPage = 1) => {
        try {
            const res = await fetcher(api.selectQuery, {
                labels,
                pageSize,
                currentPage,
            });
            if (res.code === 0) {
                const result = res.data;
                return result;
            } else {
                // message.error(res.errmsg)
            }
        } catch (e) {
            // message.error(e.errmsg)
        }
    }
    formatData = (groupLabels) => {
        const result = groupLabels.map(group => {
            let { labels } = group;
            let content = labels.map(label => {
                return {
                    name: label.labelName,
                    key: label.id,
                    faterId: label.labelGroupId
                };
            });
            content.unshift({
                name: '全部',
                key: '全部',
            });
            return {
                title: {
                    name: group.groupName,
                    key: group.id,
                },
                content,
                showItemAll: false,
                activeKey: '全部',
            };
        });
        return result;
    }
    formatImgUrl = (imgUrl) => {
        const { imgPrefix } = this.state;
        if (imgUrl.indexOf(imgPrefix) >= 0 || imgUrl.indexOf('http://') >= 0) {
            return imgUrl;
        }
        return imgPrefix + imgUrl;
    }
    isNum = (value) => {
        if (value != null && value !== '') {
            return !isNaN(value);
        }
        return false;
    }
    getImgUrl = (images = [], scale = 1) => {
        const imgArr = images.filter(img => img.scale === scale);
        let imagesObj = imgArr.length > 0 ? imgArr[0] : images[0] || {};
        const url = imagesObj.url || '';
        const finalUrl = this.formatImgUrl(url);
        return finalUrl;
    }
    // 收集选中的条件
    getherSelectQuery = (conditions) => {
        const labelArr = conditions.map(condition => {
            return condition.activeKey;
        });
        const resultArr = labelArr.filter(this.isNum);
        return resultArr.join(',');
    }
    handlePagination = (page) => {
        this.setState({
            currentPage: page,
        }, async () => {
            const { pageSize, labels } = this.state;
            const totalVideosData = await this.fetchSelectQuery(labels, pageSize, page);
            this.setState({
                videos: totalVideosData.videos,
            });
        });
    }
    // 计算有多少页
    getTotalPage = (pageSize, totalItem) => {
        const totalPage = Math.ceil(Number(totalItem) / Number(pageSize));
        return totalPage;
    }
    hightCondition = (labels = '', conditions) => {
        const labelsArr = labels.split('--');
        conditions.forEach(subject => {
            if (subject.content) {
                subject.content.forEach((item, index) => {
                    if (labelsArr.indexOf(String(item.key)) > -1) {
                        subject.activeKey = item.key;
                        if (index >= 9) {
                            subject.showItemAll = true;
                        }
                    }
                });
            }
        });
        return conditions;
    }
    initData = async () => {
        const labels = (this.props.url.query.q || '').split('--').join(',');
        const groupLabels = await this.fetchAllGroupLabels();
        const conditions = this.formatData(groupLabels);
        const totalVideosData = await this.fetchSelectQuery(labels);
        this.setState({
            loading: false,
            conditions: this.hightCondition(this.props.url.query.q, conditions),
            videos: totalVideosData.videos,
            totalItem: totalVideosData.records
        });
    }
    changeRouter = (labels = '') => {
        const router = labels && labels.split(',').join('--') || '';
        Router.push(`/screen?q=${router}`, router ? `/screen/${router}` : '/screen');
    }
    setSearchCondition = (currentFatherKey, targetKey) => {
        const { conditions } = this.state;
        const result = conditions.map(singleData => {
            if (singleData.title.key === currentFatherKey) {
                singleData.activeKey = targetKey;
            }
            return singleData;
        });
        this.setState({
            currentPage: 1,
            conditions: result
        }, async () => {
            const { currentPage, pageSize } = this.state;
            const labels = this.getherSelectQuery(result);
            // debugger
            this.changeRouter(labels);
            const totalVideosData = await this.fetchSelectQuery(labels, pageSize, currentPage);
            this.setState({
                labels,
                videos: totalVideosData.videos,
                totalItem: totalVideosData.records
            });
        });
    }
    changeConditionItemCount = (currentFatherKey) => {
        const { conditions } = this.state;
        const result = conditions.map(singleData => {
            if (singleData.title.key === currentFatherKey) {
                singleData.showItemAll = !singleData.showItemAll;
            }
            return singleData;
        });
        this.setState({
            conditions: result
        });
    }
    fixNum = (num) => {
        if (num > 9 || num === 0) {
            return num;
        } else {
            return '0' + num;
        }
    }
    transPlayTime = (time) => {
        const hour = Math.floor((time / 3600) % 24);
        const min = this.fixNum(Math.floor((time / 60) % 60));
        const sec = this.fixNum(Math.floor(time % 60));
        return hour + ':' + min + ':' + sec;
    }
    getDuration = (video) => {
        if (video.categories === 1 && video.bizType === 3) {
            const time = this.transPlayTime(video.duration);
            return time;
        }
    }
    componentDidMount = () => {
        this.initData();
    }

    render() {
        const { conditions, totalItem, videos, pageSize, currentPage, loading } = this.state;
        const totalPage = this.getTotalPage(pageSize, totalItem);
        return (
            <div style={{ paddingTop: '60px' }}>
                <SubVideosCss />
                <div className={classNames['main']}>
                    <Head>
                        <title key='screen-title'>{title + pageTitle}</title>
                        <meta name='keywords' content={keywords}/>
                        <meta name='description' content={description}/>
                    </Head>
                    <Header
                        hidexIndex = {false}
                        headStyle={{ height: 60 }}
                        curChannelId={'screen'}
                    />
                    <div className={classNames['screenHeader']}>
                        <ScreenHeader
                            conditions={conditions}
                            setSearchCondition={this.setSearchCondition}
                            changeConditionItemCount={this.changeConditionItemCount}
                        />
                    </div>
                    <section className={classNames['content-wrap']} style={{ display: loading ? 'none' : 'block' }}>
                        <h6>共筛选出{totalItem}条结果</h6>
                        <SubVideoContent>
                            {
                                videos && videos.map((video, index) => {
                                    const linkProps = getLinkProps(video);
                                    const duration = this.getDuration(video);
                                    let mr = index === ((parseInt(index / 6) + 1) * 6 - 1) ? '0' : '20px';
                                    return (
                                        <VideoItem
                                            key={video.videoBaseId}
                                            linkProps={linkProps}
                                            width='180'
                                            height='102'
                                            title={video.name}
                                            duration={duration}
                                            topRightStr={video.extMap && video.extMap.sign}
                                            topLeftStr={video.extMap && video.extMap.clarity}
                                            bottomRightStr={video && video.extMap && video.extMap.updateEpisode}
                                            imgUrl={video && video.images && this.getImgUrl(video.images, 1)}
                                            style={{ marginRight: mr }}
                                        />
                                    );
                                })
                            }
                        </SubVideoContent>
                        {
                            videos && videos.length === 0
                                ? <NoResult/>
                                : <section className={classNames['page-wrap']}>
                                    <Pagination
                                        totalPage={totalPage}
                                        currentPage={currentPage}
                                        onPageChange={this.handlePagination}
                                    />
                                </section>
                        }
                    </section>
                </div>
                <Footer></Footer>
                <ToTop/>
            </div>
        );
    }
}

export default Screen;
