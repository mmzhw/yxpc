import React, { Component } from 'react';
import classNames from './style.css';
import Link from 'next/link';

export default class UrlSelect extends Component {
    linkChange() {
        const { urlSelectData, targetBlank } = this.props;
        const target = targetBlank ? '_blank' : '_self';
        // 处理空链接和空linkProps（fix多行多列swiper布局异常的问题）
        if (urlSelectData === undefined || !/^\/play\/.+/.test(urlSelectData.as) || /null/.test(urlSelectData.as)) {
            return (
                <a className={classNames['video']}>
                    {this.props.children}
                </a>
            );
        }
        switch (target) {
            case '_blank':
                return (
                    <a className={classNames['video']} href={urlSelectData.as} target='_blank'>
                        {this.props.children}
                    </a>
                );
            case '_self':
                return (
                    <Link {...urlSelectData}>
                        <a className={classNames['video']}>
                            {this.props.children}
                        </a>
                    </Link>
                );
            default: return;
        }
    }
    render() {
        return (
            <div>
                {this.linkChange()}
            </div>

        );
    }
}
