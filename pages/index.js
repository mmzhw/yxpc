import React, { Component } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import classNames from '../components/HomePage/style.css';
import Footer from '../components/Footer';
import ToTop from '../components/toTop';
import Advertise from '../components/Advertises';
import SubVideosCss from '../components/HomePage/SubVideos/SubVideosCss';
import VideosTepl1 from '../components/HomePage/VideosTepl/VideosTepl1';
import VideosTepl2 from '../components/HomePage/VideosTepl/VidoesTepl2';
import VideosTepl3 from '../components/HomePage/VideosTepl/VideosTepl3';
import VideosTepl4 from '../components/HomePage/VideosTepl/VideosTepl4';
import VideosTepl5 from '../components/HomePage/VideosTepl/VideosTepl5';
import VideosTepl6 from '../components/HomePage/VideosTepl/VideosTepl6';
import BannerFull from '../components/banner/BannerFull';
import { handleImgUrl } from '../utils/handleUrl';
import fetcher from '../utils/fetch';
import { pageTitle } from '../utils';
import NAME from '../constants/index';
import Error from 'next/error';

export default class homepage extends Component {
    static getInitialProps = async () => {
        const tabRes = await fetcher('/web/ableChannel/v2', {});
        const tabs = tabRes.data;
        const firstTab = tabs[0];
        const channelRes = await fetcher('/web/lego/channel/v2', { channelId: firstTab.id });
        const bannerRes = await fetcher('/web/banner', { channelId: firstTab.id });
        const banners = bannerRes.data;
        const advertises = [];
        for (let i = 1; i < 5; i++) {
            const advertiseRes = await fetcher('/web/ad/detail/v1', { adid: '00' + i });
            advertises.push(advertiseRes.data);
        }
        const advertList = advertises.slice(0, 3);
        const channelList = channelRes.data;
        return {
            errorCode: tabRes.code || channelRes.code || bannerRes.code,
            banners,
            tabs,
            channelList,
            advertises,
            advertList
        };
    }

    state = {
        curBannerIndex: 0,
        menuDisable: false,
    }

    scrollHandler = this.handleScroll.bind(this)

    componentDidMount() {
        this.scrollHandler();
        window.addEventListener('scroll', this.scrollHandler);

        /* ------- 通过go(-1) 进入页面情况下，滚动位置到浏览器之前的位置 -------*/
        let scrollTop = sessionStorage ? sessionStorage.getItem('indexPageScrollTop') : 0;
        document.documentElement.scrollTop = scrollTop;
        /* ------- 通过go(-1) 进入页面情况下，滚动位置到浏览器之前的位置 -------*/
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollHandler);
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        /* ------- 通过go(-1) 进入页面情况下，滚动位置到浏览器之前的位置 -------*/
        if (sessionStorage) {
            sessionStorage.setItem('indexPageScrollTop', scrollTop);
        }
        /* ------- 通过go(-1) 进入页面情况下，滚动位置到浏览器之前的位置 -------*/
    }

    handleScroll() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.setState({
            menuDisable: scrollTop > 96,
        });
    }

    render() {
        // 请求错误处理
        if (this.props.errorCode !== 0) {
            return (<Error statusCode={this.props.errorCode} />);
        }

        const { banners, channelList, tabs, advertises, advertList } = this.props;
        return (
            <div className={classNames.homepage}>
                <Head>
                    <title key='homepage-title'>{pageTitle}</title>
                    <meta name='keywords' content={NAME.keywords} />
                    <meta name='description' content={NAME.description} />
                </Head>
                <SubVideosCss />
                {
                    this.state.menuDisable ? (
                        <Header
                            index={false}
                            hidexIndex={true}
                            headStyle={{ position: 'fixed', top: 0, left: 0, zIndex: 39, height: 68 }}
                        />
                    ) : (
                        <Header
                            index={true}
                            hidexIndex={false}
                            headStyle={{ height: 60 }}
                        />
                    )
                }
                {this.state.menuDisable ? (<div style={{ height: '60px' }} />) : null}

                <div className={classNames.header}>
                    <div className={classNames.indexNav}>
                        <div>
                            <ul>
                                {
                                    tabs && tabs.map((tab, index) => {
                                        return tab.name === '首页' ? (
                                            <li key={index}><Link href={'/'} as={'/'}><a>{tab.name}</a></Link></li>)
                                            : (<li key={index}><Link as={`/channel/${tab.id}`} href={{
                                                pathname: '/channel',
                                                query: { channelId: tab.id }
                                            }}><a>{tab.name}</a></Link></li>);
                                    })
                                }
                                <div className={classNames.clear}/>
                            </ul>
                            <div className={classNames.appDownload}>
                                <img src={'../static/image/HomePage/download.png'} />
                                <span>下载</span>
                                <div className={classNames.appInfo}>
                                    <i/>
                                    <div>
                                        <img src='../static/image/about/download.png' />
                                        <p>扫一扫</p>
                                        <p>下载有象视频</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classNames.navAll}>
                                <img src={'../static/image/HomePage/allNav.png'} />
                                <span><Link href='/screen' as={'/screen'}><a>片库</a></Link></span>
                            </div>
                            <div className={classNames.clear}/>
                        </div>
                    </div>
                    <BannerFull banners={banners} type={0}/>
                </div>
                <div className={classNames['main-content']}>
                    {
                        channelList && channelList.map((channel, index) => {
                            const advertise = advertList[index];
                            switch (Number(channel.sectionLayout)) {
                                case 1:
                                    return (
                                        <div key={index}>
                                            <VideosTepl1 cards={channel.cards} key={channel.sectionId} />
                                            {
                                                advertise &&
                                                <div style={{ marginTop: '20px' }}>
                                                    <Advertise
                                                        url={advertise.contentUrl}
                                                        src={handleImgUrl(advertise.imageUrl)}>
                                                    </Advertise>
                                                </div>
                                            }
                                        </div>
                                    );
                                case 2:
                                    return (
                                        <div key={index}>
                                            <VideosTepl2 cards={channel.cards} key={channel.sectionId} />
                                            {
                                                advertise &&
                                                <div style={{ marginTop: '20px' }}>
                                                    <Advertise
                                                        url={advertise.contentUrl}
                                                        src={handleImgUrl(advertise.imageUrl)}>
                                                    </Advertise>
                                                </div>
                                            }
                                        </div>
                                    );
                                case 3:
                                    return (
                                        <div key={index}>
                                            <VideosTepl3 cards={channel.cards} key={channel.sectionId} />
                                            {
                                                advertise &&
                                                <div style={{ marginTop: '20px' }}>
                                                    <Advertise
                                                        url={advertise.contentUrl}
                                                        src={handleImgUrl(advertise.imageUrl)}>
                                                    </Advertise>
                                                </div>
                                            }
                                        </div>
                                    );
                                case 4:
                                    return (
                                        <div key={index}>
                                            <VideosTepl4
                                                cards={channel.cards}
                                                key={channel.sectionId}
                                                timeLine={channel.timeLine}
                                                citys={channel.cards[0].title === '新城镇·新资讯' ? tabs[1] : null}
                                            />
                                            {
                                                advertise &&
                                                <div style={{ marginTop: '20px' }}>
                                                    <Advertise
                                                        url={advertise.contentUrl}
                                                        src={handleImgUrl(advertise.imageUrl)}>
                                                    </Advertise>
                                                </div>
                                            }
                                        </div>
                                    );
                                case 5:
                                    return (
                                        <div key={index}>
                                            <VideosTepl5 cards={channel.cards} key={channel.sectionId} />
                                            {
                                                advertise &&
                                                <div style={{ marginTop: '20px' }}>
                                                    <Advertise
                                                        url={advertise.contentUrl}
                                                        src={handleImgUrl(advertise.imageUrl)}>
                                                    </Advertise>
                                                </div>
                                            }
                                        </div>
                                    );
                                case 6:
                                    return (
                                        <div key={index}>
                                            <VideosTepl6 cards={channel.cards} key={channel.sectionId} />
                                            {
                                                advertise &&
                                                <div style={{ marginTop: '20px' }}>
                                                    <Advertise
                                                        url={advertise.contentUrl}
                                                        src={handleImgUrl(advertise.imageUrl)}>
                                                    </Advertise>
                                                </div>
                                            }
                                        </div>
                                    );
                            }
                        })
                    }
                    {
                        advertises[3] &&
                        <div style={{ marginTop: '20px' }}>
                            <Advertise
                                url={advertises[3].contentUrl}
                                src={handleImgUrl(advertises[3].imageUrl)}>
                            </Advertise>
                        </div>
                    }
                </div>
                <ToTop />
                <Footer></Footer>
            </div>

        );
    }
}
