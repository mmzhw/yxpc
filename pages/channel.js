import React, { Component } from 'react';
import Header from '../components/Header';
import classNames from '../components/Channel/style.css';
import Head from 'next/head';
import cn from 'classnames';
import ToTop from '../components/toTop';
import Footer from '../components/Footer';
import BannerFull from '../components/banner/BannerFull';
import Banner from '../components/banner';
import SubVideosCss from '../components/HomePage/SubVideos/SubVideosCss';
import VideosTepl1 from '../components/HomePage/VideosTepl/VideosTepl1';
import VideosTepl2 from '../components/HomePage/VideosTepl/VidoesTepl2';
import VideosTepl3 from '../components/HomePage/VideosTepl/VideosTepl3';
import VideosTepl4 from '../components/HomePage/VideosTepl/VideosTepl4';
import VideosTepl5 from '../components/HomePage/VideosTepl/VideosTepl5';
import VideosTepl6 from '../components/HomePage/VideosTepl/VideosTepl6';
import fetcher from '../utils/fetch';
import { sortBysort, pageTitle, PAGE_SHOW_NUM } from '../utils';
import Link from 'next/link';
import Error from 'next/error';

export default class homepage extends Component {
    static getInitialProps = async (context) => {
        const { channelId, secondChannelId } = context.query;
        const curChannelId = secondChannelId || channelId;
        const channelRes = await fetcher('/web/lego/channel/v2', { channelId: curChannelId });
        const channelList = (channelRes && channelRes.data) ? channelRes.data : [];

        const tabRes = await fetcher('/web/ableChannel/v2', {});
        const tabs = (tabRes && tabRes.data) ? tabRes.data : [];

        const bannerRes = await fetcher('/web/banner', { channelId: curChannelId });
        const banners = (bannerRes && bannerRes.data) ? sortBysort(bannerRes.data) : null;

        return {
            errorCode: channelRes.code,
            banners,
            tabs,
            channelList,
            curChannelId,
            secondChannelId,
            curParentChannelId: channelId,
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            curCityIndex: 0,
        };
    }
    arrowOnClick = (num) => {
        this.setState(prevState => {
            return { curCityIndex: prevState.curCityIndex + num };
        });
    }

    render() {
        // 请求错误处理
        if (this.props.errorCode !== 0) {
            return (<Error statusCode={this.props.errorCode} />);
        }

        const { tabs, channelList, banners, curParentChannelId, curChannelId } = this.props;
        const curTabs = tabs.filter(tab => {
            return Number(tab.id) === Number(curParentChannelId);
        });
        const curTab = curTabs[0] || {};

        let secondChannelId = parseInt(this.props.secondChannelId);
        let allCitys = secondChannelId ? '' : 'actived';

        /* 这里把 curCityIndex 的值 */
        return (
            <div style={{ paddingTop: '60px' }}>
                <Head>
                    <title key='channel-title'>{curTab.name}-{pageTitle}</title>
                    <meta name='keywords' content='有象视频官网, 有象, 有象视频, 视频, 视频网站, 电影, 综艺, 少儿, 电视剧, 直播, 高清视频, 在线观看' />
                    <meta name='description'
                        content='有象视频，是金诚集团旗下杭州大象网络文化集团重点推出的综合性视频平台。依托于集团多年来在文化产业板块的深耕与布局，有象视频将自制、引入并聚合电影、电视剧、动漫、综艺、明星演唱会、竞技赛事、VR体验、在线直播等优质内容，打造一个“无广告、零插播、高清畅快”的全民VIP视频文化平台。' />
                </Head>
                <SubVideosCss />
                <Header
                    hidexIndex={false}
                    headStyle={{ height: 60 }}
                    curChannelId={curChannelId}
                />
                {
                    !banners ? null : curTab && curTab.name === '新城镇' ? (<BannerFull banners={banners} type={1} />) : <Banner banners={banners} />
                }
                {
                    curTab && curTab.name === '新城镇' && <div className={classNames['cityLine']}>
                        <div className={classNames['line']}>
                            <div className={classNames['mask1']} />
                            <div className={classNames['mask2']}/>
                        </div>
                        {
                            (curTab.secoundChannels instanceof Array && curTab.secoundChannels.length > PAGE_SHOW_NUM) && (<div className={classNames['arrowBox']}>
                                <div className={cn(classNames['arrowLeft'], { [classNames['none']]: this.state.curCityIndex === 0 })} onClick={() => { this.arrowOnClick(-1); }}/>
                                <div className={cn(classNames['arrowRight'], { [classNames['none']]: this.state.curCityIndex === curTab.secoundChannels.length + 1 - PAGE_SHOW_NUM })} onClick={() => { this.arrowOnClick(1); }} />
                            </div>)
                        }
                        <div className={classNames['cityBox']}>

                            <ul className={classNames['city']} style={{ left: (this.state.curCityIndex * -130) + 'px' }}>
                                <li className={classNames[allCitys]}>
                                    <Link as={`/channel/${curTab.id}`}
                                        href={{ pathname: '/channel', query: { channelId: curTab.id }}}><a>全部</a></Link><i></i>
                                </li>
                                {
                                    curTab.secoundChannels && curTab.secoundChannels.map((secoundChannel, index) => {
                                        let singleCity = secondChannelId && secoundChannel.id === secondChannelId ? 'actived' : '';
                                        return (
                                            <li key={index} className={classNames[singleCity]}>
                                                <Link as={`/channel/${curTab.id}/${secoundChannel.id}`} href={{
                                                    pathname: '/channel',
                                                    query: { channelId: curTab.id, secondChannelId: secoundChannel.id }
                                                }}><a>{secoundChannel.name}</a></Link>
                                                <i></i>
                                            </li>
                                        );
                                    })
                                }
                                <div className={classNames['clear']}></div>
                            </ul>
                        </div>
                    </div>
                }

                <div className={classNames['main-content']}>
                    {
                        channelList instanceof Array && channelList.map(channel => {
                            switch (channel.sectionLayout) {
                                case 1:
                                    return (
                                        <VideosTepl1 cards={channel.cards} key={channel.sectionId} />
                                    );
                                case 2:
                                    return (
                                        <VideosTepl2 cards={channel.cards} key={channel.sectionId} />
                                    );
                                case 3:
                                    return (
                                        <VideosTepl3 cards={channel.cards} key={channel.sectionId} />
                                    );
                                case 4:
                                    return (
                                        <VideosTepl4 cards={channel.cards} key={channel.sectionId} />
                                    );
                                case 5:
                                    return (
                                        <VideosTepl5 cards={channel.cards} key={channel.sectionId} />
                                    );
                                case 6:
                                    return (
                                        <VideosTepl6 cards={channel.cards} key={channel.sectionId} />
                                    );
                            }
                        })
                    }
                </div>
                <ToTop></ToTop>
                <div className={classNames['bottom-space']}></div>
                <Footer></Footer>
            </div>
        );
    }
}
