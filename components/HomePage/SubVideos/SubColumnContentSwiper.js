import React, { Component } from 'react';
import classNames from './style.css';
import cn from 'classnames';

export default class SubVideContentSwiper extends Component {
  static defaultProps = {
      swiperClass: 'swiper-contain',
      isSwiper: false,
      swiperOption: {
          slidesPerView: 6,
          spaceBetween: 14
      }
  }
  state={
      maxNumber: '',
      addNumber: '',
      counter: 0,
      swiperLeft_one: false,
      swiperRight_one: true
  }
  componentDidMount() {
      const { isSwiper, swiperClass, swiperOption, needData, layoutId } = this.props;
      let maxCounter, addNumber;
      switch (layoutId) {
          case 2:
              maxCounter = Math.ceil(needData.length / 12) - 1;
              addNumber = 12;
              break;
          case 5:
              maxCounter = Math.ceil(needData.length / 4) - 1;
              addNumber = 4;
              break;
          case 7:
              maxCounter = Math.ceil(needData.length / 1) - 1;
              addNumber = 1;
              break;
          default :
              maxCounter = Math.ceil(needData.length / 6) - 1;
              addNumber = 6;
      }
      this.setState({
          maxNumber: addNumber * maxCounter,
          addNumber: addNumber
      });
      if (isSwiper) {
          if (this.swiper) this.swiper.detachEvents && this.swiper.detachEvents();
          this.swiper = new Swiper(`.${swiperClass}`, Object.assign({}, swiperOption, {
              nextButton: '.swiper-button-next',
              prevButton: '.swiper-button-prev'
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
  // 轮播按钮向前
  swiperPrev() {
      let { counter, maxNumber, addNumber } = this.state;
      let self = this;
      counter = counter <= addNumber ? (function() { self.setState({ swiperLeft_one: false }); return 0; })() : counter - addNumber;
      this.swiper.slideTo(counter, 1000, false);
      this.setState({ counter: counter, swiperRight_one: true });
  }
  // 轮播按钮向后
  swiperNext() {
      let { counter, maxNumber, addNumber } = this.state;
      let self = this;
      counter = (counter >= maxNumber - addNumber ? (function() { self.setState({ swiperRight_one: false }); return maxNumber; })() : counter + addNumber);
      this.swiper.slideTo(counter, 1000, false);
      this.setState({ counter: counter, swiperLeft_one: true });
  }
  render() {
      const { isSwiper, swiperOption, layoutId } = this.props;
      const specialLeft = swiperOption.slidesPerColumn ? 'swiper-change-left' : '';
      const specialRight = swiperOption.slidesPerColumn ? 'swiper-change-right' : '';
      // 模板样式：1+2x2 特殊处理布局
      const isLeftColumn = layoutId === 7 && swiperOption.slidesPerView === 1;
      const isRightColumn = layoutId === 7 && swiperOption.slidesPerView === 2;
      let cls = '';
      if (isLeftColumn) {
          cls = classNames['swiper-container-left-column'];
      } else if (isRightColumn) {
          cls = classNames['swiper-container-right-column'];
      }
      return (
          <div className={classNames['swiper-container-wrap']}>
              <div className={cn(classNames['swiper-container'], this.props.swiperClass, cls)} style={{ overflow: 'hidden', width: '1152px' }}>
                  <span className='swiper-wrapper'>
                      { this.props.children }
                  </span>
              </div>
              {
                  !!isSwiper && this.state.swiperLeft_one &&
                (
                    <div className={classNames['swiper-button-prev'] + ' ' + classNames[specialLeft]} style={{ left: layoutId === 7 ? '0' : '-50px' }} onClick={this.swiperPrev.bind(this)}></div>
                )
              }
              {
                  !!isSwiper && this.state.swiperRight_one &&
                (
                    <div className={classNames['swiper-button-next'] + ' ' + classNames[specialRight]} style={{ right: layoutId === 7 ? '0' : '-50px' }} onClick={this.swiperNext.bind(this)}></div>
                )
              }
          </div>
      );
  }
}
