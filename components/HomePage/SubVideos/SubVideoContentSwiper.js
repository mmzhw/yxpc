import React, { Component } from 'react';
import propTypes from 'prop-types';
import classNames from './style.css';
import cn from 'classnames';
// import Swiper from 'swiper';

export default class SubVideContentSwiper extends Component {
  static propTypes = {
      swiperClass: propTypes.string,
      isSwiper: propTypes.bool,
      swiperOption: propTypes.object
  }

  static defaultProps = {
      swiperClass: 'swiper-contain',
      isSwiper: false,
      swiperOption: {
          slidesPerView: 6,
          spaceBetween: 14,
      }
  }

  componentDidMount() {
      const { isSwiper, swiperClass, swiperOption } = this.props;
      if (isSwiper) {
          if (this.swiper) this.swiper.detachEvents && this.swiper.detachEvents();
          this.swiper = new Swiper(`.${swiperClass}`, Object.assign({}, swiperOption, {
              navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                  disabledClass: classNames['my-button-disabled'],
              },

          }));
      } else {
          this.swiper = new Swiper(`.${swiperClass}`, swiperOption);
          if (Array.isArray(this.swiper)) {
              this.swiper.forEach(swiper => {
                  swiper.detachEvents();
              });
          } else {
              this.swiper.detachEvents();
          }
      }
  }

  // componentWillUnmount() {
  //   this.swiper.detachEvents()
  // }

  render() {
      const { isSwiper } = this.props;
      return (
          <div className={cn(classNames['swiper-container'], this.props.swiperClass)} style={{ overflow: 'hidden', width: '1280px' }}>
              <div className='swiper-wrapper'>
                  { this.props.children }
              </div>
              {
                  !!isSwiper &&
            (
                <div className={cn('swiper-button-prev', 'swiper-button-black', classNames['swiper-button-prev'])}></div>
            )
              }
              {
                  !!isSwiper &&
            (
                <div className={cn('swiper-button-next', 'swiper-button-black', classNames['swiper-button-next'])}></div>
            )
              }
          </div>
      );
  }
}
