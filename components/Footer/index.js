import React, { Component } from 'react';
import classNames from './style.css';
import fetcher from '../../utils/fetch';
import Link from 'next/link';

export default class Footer extends Component {
    state = {
        tabs: null
    }

    fetchTabs = async () => {
        const tabRes = await fetcher('/web/ableChannel/v2', {});
        const tabs = tabRes.data;
        return tabs;
    }

    async componentDidMount() {
        const tabs = await this.fetchTabs();
        this.setState({
            tabs
        });
    }

    render() {
        const { tabs } = this.state;
        let newCityTabs = [];
        if (tabs) {
            tabs.forEach((tab) => {
                if (tab.name === '新城镇') {
                    newCityTabs = tab;
                }
            });
        }
        return (
            <div className={classNames['footer']}>
                <div className={classNames['footerContent']}>
                    <ul>
                        <p>友情链接</p>
                        <li><Link href='http://www.jcgroup.com.cn/index.php/welcome.html'><a target='_blank'>金诚集团</a></Link></li>
                        <li><Link href='http://www.jcpppc.com/'><a target='_blank'>金诚新城镇集团</a></Link></li>
                        <li><Link href='http://www.jcgroup.com.cn/index.php/finance.html'><a target='_blank'>金诚财富</a></Link></li>
                        <li><Link href='http://www.jcgroup.com.cn/index.php/industry/index/22.html'><a target='_blank'>金诚酒店</a></Link></li>
                        <li><Link href='http://www.jcease.com'><a target='_blank'>金诚逸</a></Link></li>
                    </ul>

                    <ul className={classNames['nav']}>
                        <p>站点导航</p>
                        {
                            tabs && tabs.map((tab, index) => {
                                return tab.name === '首页' ? (<li key={index}><Link href={'/'}><a>{tab.name}</a></Link></li>)
                                    : (<li key={index}><Link as={`/channel/${tab.id}`} href={{
                                        pathname: '/channel',
                                        query: { channelId: tab.id }
                                    }}><a>{tab.name}</a></Link></li>);
                            })
                        }
                        <div className={classNames['clear']}/>
                    </ul>

                    <ul className={classNames['city']}>
                        <p>新城镇</p>
                        {
                            newCityTabs && newCityTabs.secoundChannels && newCityTabs.secoundChannels.map((secondChannel, index) => {
                                return (
                                    <li key={index}>
                                        <Link as={`/channel/${newCityTabs.id}/${secondChannel.id}`} href={{
                                            pathname: '/channel',
                                            query: { channelId: newCityTabs.id, secondChannelId: secondChannel.id }
                                        }}><a>{secondChannel.name}</a></Link>
                                    </li>
                                );
                            })
                        }
                        <div className={classNames['clear']}/>
                    </ul>

                    <ul className={classNames['download']}>
                        <p>软件下载</p>
                        <a href='/about#intro'>
                            <i/>
                            <span>iPhone</span>
                        </a>
                        <a href='/about#intro'>
                            <i/>
                            <span>Android</span>
                        </a>
                        <div className={classNames['clear']}/>
                    </ul>

                    <ul>
                        <p>关于我们</p>
                        <li><a href='/about#intro'>公司介绍</a></li>
                        <li><a href='/about#join'>诚聘英才</a></li>
                        <li><a href='/about#contact'>联系我们</a></li>
                        <li><a href='/about#contact'>侵权投诉</a></li>
                    </ul>

                    <div className={classNames['clear']}/>
                </div>

                <div className={classNames['footerBottom']}>
                    <p>杭州大象网络文化集团有限公司  |  400-058-0158  |  杭州市拱墅区登云路43号金诚大厦3F</p>
                    <p>网络文化经营许可证 浙网文[2017]7487-498号 | 信息网络传播视听节目许可证0109405号</p>
                    <p>youxiang0210.com 2018 © All Rights Reserved.  |  浙ICP备17019757号</p>
                </div>
            </div>
        );
    }
}
