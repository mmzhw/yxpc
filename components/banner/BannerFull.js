import React, { Component } from 'react';
import Router from 'next/router';
import { handleImgUrl } from '../../utils/handleUrl';
// import Swiper from 'swiper';
import cn from 'classnames';
import classNames from './bannerFull.css';

// banners 数组，type：0代表分页器背景为渐变，1代表分页器背景为白色透明无渐变
export default class BannerFull extends Component {
    componentDidMount() {
        this.initSwiper();
    }

    componentDidUpdate() {
        this.initSwiper();
    }

    componentWillUnmount() {
        this.clearDom();
    }

    initSwiper() {
        let self = this;
        self.clearDom();

        let option = {
            speed: 500,
            autoplay: {
                delay: 5000
            },
        };
        option.on = {
            click: function () {
                // 轮播图点击跳转
                Router.push(self.props.banners[this.clickedIndex].schemeUrl);
            },
        };
        option.pagination = {
            el: '.swiper-pagination',
            bulletClass: classNames.myBullet,
            bulletActiveClass: classNames.myActive,
            renderBullet: function (index, className) {
                // 分页器点击跳转
                if (self.props.banners && self.props.banners.length > 0) {
                    return '<li class="' + className + '"><p>' + self.props.banners[index].title + '</p><p>' + self.props.banners[index].secondTitle + '</p></li>';
                }
            },
        };
        window.mySwiper = self.mySwiper = new window.Swiper('.swiper-container', option);

        // 鼠标滑过pagination控制swiper切换
        for (let i = 0; i < self.mySwiper.pagination.el.children.length; i++) {
            self.mySwiper.pagination.el.children[i].index = i;
            self.mySwiper.pagination.el.children[i].schemeUrl = self.props.banners[i].schemeUrl;
            self.mySwiper.pagination.el.children[i].onmouseover = function () {
                self.mySwiper.slideTo(this.index);
            };
            self.mySwiper.pagination.el.children[i].onclick = function () {
                Router.push(this.schemeUrl);
            };
        }
    }

    clearDom() {
        let self = this;
        if (self.mySwiper) {
            for (let i = 0; i < self.mySwiper.pagination.el.children.length; i++) {
                // 销毁时清除所有元素绑定值
                self.mySwiper.pagination.el.children[i].index = null;
                self.mySwiper.pagination.el.children[i].schemeUrl = null;
                self.mySwiper.pagination.el.children[i].onmouseover = null;
                self.mySwiper.pagination.el.children[i].onclick = null;
            }
            self.mySwiper.destroy(false, true);
            self.mySwiper = null;
        }
    }

    render() {
        return (
            <div className={classNames.wrapper} ref='verticalWrapper'>
                <div className={cn('swiper-container', classNames.swiperWrapper)}>
                    <div className={cn('swiper-wrapper', classNames.swiperWidth)}>
                        {
                            this.props.banners && this.props.banners.map((banner, index) => {
                                let imageUrl = handleImgUrl(banner.imageUrl);
                                return (
                                    <div className={cn('swiper-slide', classNames.swiperSlide)} key={index}>
                                        <img alt={banner.title} src={imageUrl}/>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className={ cn(classNames.paginationWrapper, !this.props.type ? classNames.indexBackgroud : '')}>
                    <div className={cn('swiper-pagination', classNames.pagination, this.props.type ? classNames.pageBackgroud : '')}/>
                </div>
            </div>
        );
    }
}
