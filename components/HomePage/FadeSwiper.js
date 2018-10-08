const util = require('./swiperUtil');
// paginations: paginations的选择器
// autoPlay: 自动播放的间隔
// animationDuration: 动画播放的时间
// paginationActive: 活跃pagination的类
// swiperEvent: swiper的事件
class Swiper {
    constructor(selector, opts) {
        this.opts = Object.assign({}, opts);
        this.container = document.querySelector(selector);
        this.sliderWrap = document.querySelector('.swiper-wrapper');
        this.sliders = Array.from(this.sliderWrap.querySelectorAll('.swiper-slider'));
        this.slidersLength = this.sliders.length;
        this.autoPlay = opts.autoPlay;
        this.animationDuration = opts.animationDuration;
        this.swiperEvent = opts.swiperEvent || 'click';
        this.swiperID = performance.now();
        this.selectors = {
            paginations: this.opts.paginations || '.banner-cursors',
            cursor: this.opts.cursor || '.cursor'
        };

        this.pageIndex = 0;
        this.sliderIndex = 0;

        this.isCanStep = true;

        this.initSliders();
        this.initEvents();
        if (this.selectors.paginations) {
            this.paginationsWrap = this.container.querySelector(this.selectors.paginations);
            this.paginations = Array.from(this.paginationsWrap.querySelectorAll(this.selectors.cursor));
            this.initPaginationEvents();
        }
        this.initStep();
    }

    initEvents() {
    // console.log('this.sliderWrap', this.sliderWrap)
        this.container.addEventListener('mouseenter', this.stopAutoPlay);
        this.container.addEventListener('mouseleave', this.play);
    }

    initPaginationEvents() {
        this.paginations.forEach((pagination, index) => {
            pagination.addEventListener(this.swiperEvent, () => {
                this.stopAutoPlay();
                this.step(index, false);
            });
        });
        util.emitter.emit('sliderIndexChange', this.sliderIndex);
    }

  destoryEvents = () => {
      this.container.removeEventListener('mouseenter', this.stopAutoPlay);
      this.container.removeEventListener('mouseleave', this.play);
      this.nextButton && this.nextButton.removeEventListener('click', this.next);
      this.preButton && this.preButton.removeEventListener('click', this.pre);
      this.stopAutoPlay();
      util.emitter.off('sliderIndexChange');
  }

  play = () => {
      this.beforePlay();
      clearTimeout(this.playID);
      this.autoPlay = this.opts.autoPlay;
      this.playID = setTimeout(this.next.bind(this), this.autoPlay);
  }

  stopAutoPlay = () => {
      clearTimeout(this.playID);
      this.autoPlay = 0;
  }

  beforePlay() {
      this.beforeDate = new Date();
  }

  endPlay() {
      this.endDate = new Date();
      // console.log('diff time', this.endDate - this.beforeDate)
  }

  initSliders() {
      this.setSlidersNone(this.sliderIndex);
  }

  pre() {
      const stepIndex = this.sliderIndex - 1;
      this.step(stepIndex, true);
  }

  next() {
      // console.log('next', this.autoPlay)
      const stepIndex = this.sliderIndex + 1;
      this.step(stepIndex, true);
  }

  initStep() {
      if (this.sliders.length < 1) return;
      this.step(this.sliderIndex, false);
  }
  // 计算下一次要更新的sliderIndex,隐藏所有其他的slider;执行动画
  step(index, isAnimate) {
      if (this.slidersLength < 2) return;
      const nextSliderIndex = this._normalizeIndex(index, this.slidersLength);
      this.nextSliderIndex = nextSliderIndex;
      if (this.sliderIndex === null || this.nextSliderIndex === null) return;
      const nextSlider = this.sliders[this.nextSliderIndex];
      this.isCanStep = false;
      this.setSlidersNone(nextSlider);
      util.emitter.emit('sliderIndexChange', this.nextSliderIndex);

      if (isAnimate) {
          const animationDuration = this.animationDuration;
          this.animate(nextSlider, animationDuration);
      } else {
          nextSlider.style.display = 'block';
          nextSlider.style.opacity = 1;
      }
      this.sliderIndex = this.nextSliderIndex;
      if (this.autoPlay) {
          this.endPlay();
          // console.log('this.playID', this.playID)
          // console.log('this.swiperID', this.swiperID)
          this.play();
      }
  }

  setSlidersNone(curIndex) {
      this.sliders.forEach((slider, index) => {
          if (index === curIndex) {
              slider.style.display = 'block';
          } else {
              slider.style.display = 'none';
          }
      });
  }

  animate(nextSlider, animationDuration) {
      util.animate(
          nextSlider,
          'opacity',
          0.7,
          1,
          animationDuration,
          () => {
              nextSlider.style.display = 'block';
          }
      );
  }

  _normalizeIndex(index, len) {
      return (index + len) % len;
  }
}

module.exports = Swiper;
