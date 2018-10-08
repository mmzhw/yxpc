import React, { Component } from 'react';
import Router from 'next/router';
import { handleImgUrl } from '../../utils/handleUrl';
// import Swiper from 'swiper';
import cn from 'classnames';
import classNames from './bannerFull.css';

// banners 数组，type：0代表分页器背景为渐变，1代表分页器背景为白色透明无渐变
export default class Banner extends Component {
    componentDidMount() {
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
                Router.push(self.mySwiper.pagination.bullets[this.clickedIndex].schemeUrl);
            },
        };
        option.pagination = {
            el: '.swiper-pagination',
            bulletClass: classNames.myBulletLine,
            bulletActiveClass: classNames.myActiveLine,
        };
        self.mySwiper = new window.Swiper('.swiper-container', option);

        // 鼠标滑过pagination控制swiper切换
        for (let i = 0; i < self.mySwiper.pagination.bullets.length; i++) {
            self.mySwiper.pagination.bullets[i].index = i;
            self.mySwiper.pagination.bullets[i].schemeUrl = self.props.banners[i].schemeUrl;
            self.mySwiper.pagination.bullets[i].onmouseover = function() {
                self.mySwiper.slideTo(this.index);
            };
        }
    }

    componentWillUnmount() {
        this.clearDom();
    }

    clearDom() {
        let self = this;
        if (self.mySwiper) {
            for (let i = 0; i < self.mySwiper.pagination.bullets.length; i++) {
                self.mySwiper.pagination.bullets[i].index = null;
                self.mySwiper.pagination.bullets[i].schemeUrl = null;
                self.mySwiper.pagination.bullets[i].onmouseover = null;
            }
            self.mySwiper.detachEvents();
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
                <div className={cn('swiper-pagination', classNames.paginationLine)}/>
            </div>
        );
    }
}
