import React, { Component } from 'react';
import Link from 'next/link';
import classNames from './header.css';
import IndexSearch from '../components/search/IndexSearch';
import fetcher from '../utils/fetch';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
        };
    }

    async componentDidMount() {
        const tabRes = await fetcher('/web/ableChannel/v2', {});
        this.setState({ tabs: tabRes.data });
    }

    render() {
        const { tabs } = this.state;
        const { curChannelId, wrapperStyle = {}} = this.props;

        let ulWidth = '100%';
        if (!this.props.hidexIndex) {
            ulWidth = (tabs.length - 7) * 50 + 'px';
        } else if (this.props.hidexIndex) {
            ulWidth = (tabs.length - 6) * 50 + 'px';
        }

        return (
            /* zIndex 在css 中打包了，会无效，应该是next 的bug */
            <div className={classNames.headerWrapper} style={{ ...wrapperStyle, zIndex: '9999' }} >

                {
                    this.props.index ? (
                        <div className={classNames.indexMenu}>
                            <div>
                                <Link href='/' as={'/'}><a>
                                    <img className={classNames.logo} src='/static/image/HomePage/logo.svg' /></a>
                                </Link>
                                <div className={classNames.searchPosition}><IndexSearch /></div>
                                <div className={classNames.clear}/>
                            </div>
                        </div>
                    ) : (
                        <header className={classNames.pageMenu} style={this.props.headStyle}>
                            <div style={{
                                paddingTop: (this.props.headStyle.height - 50) / 2 + 'px',
                                paddingBottom: (this.props.headStyle.height - 50) / 2 + 'px'
                            }}>
                                <Link href='/'>
                                    <a>
                                        <img className={classNames.logo} src='/static/image/HomePage/logo.svg' />
                                    </a>
                                </Link>
                                <div className={classNames.appDownload}>
                                    <a href='/about#intro'>
                                        <i/>
                                        <p>下载应用</p>
                                    </a>
                                </div>
                                <div className={classNames.menu}>
                                    <ul>
                                        {
                                            tabs && tabs.map((tab, index) => {
                                                if (!this.props.hidexIndex && index > 7) {
                                                    return null;
                                                } else if (this.props.hidexIndex && index > 6) {
                                                    return null;
                                                }
                                                if (tab.name === '首页') {
                                                    if (!this.props.hidexIndex) {
                                                        return (
                                                            <li key={index} className={classNames[curChannelId === tab.id + '' ? 'menu-li-active' : '']}><Link href={'/'}><a>{tab.name}</a></Link>
                                                            </li>);
                                                    }
                                                } else {
                                                    return (<li key={index} className={classNames[curChannelId === tab.id + '' ? 'menu-li-active' : '']}><Link as={`/channel/${tab.id}`} href={{
                                                        pathname: '/channel',
                                                        query: { channelId: tab.id }
                                                    }}><a>{tab.name}</a></Link></li>);
                                                }
                                            })
                                        }
                                        <li className={classNames.surplus}>
                                            <i></i>
                                            <ul style={{ zIndex: '20', width: ulWidth }}>
                                                {
                                                    tabs && tabs.map((tab, index) => {
                                                        if (!this.props.hidexIndex && index <= 7) {
                                                            return null;
                                                        } else if (this.props.hidexIndex && index <= 6) {
                                                            return null;
                                                        }
                                                        return (<li key={index} className={classNames[curChannelId === tab.id + '' ? 'menu-li-active' : '']}><Link as={`/channel/${tab.id}`} href={{
                                                            pathname: '/channel',
                                                            query: { channelId: tab.id }
                                                        }}><a>{tab.name}</a></Link></li>);
                                                    })
                                                }
                                                <li className={classNames[curChannelId === 'screen' ? 'menu-li-active' : '']}><Link href={'/screen'}><a>片库</a></Link></li>
                                            </ul>
                                        </li>
                                        <div className={classNames.clear}></div>
                                    </ul>
                                </div>
                                <div className={classNames.searchPosition}><IndexSearch /></div>
                                <div className={classNames.clear}/>
                            </div>
                        </header>
                    )
                }

            </div>
        );
    }
}

export default Header;
