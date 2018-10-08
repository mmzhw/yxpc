import React, { Component } from 'react';
import Link from 'next/link';
import classNames from './teleplay.css';
import cn from 'classnames';
import { imgPrefix } from '../../utils/url';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            introShowAll: false,
        };
        this.introLimit = 150;
        this.toggleIntroDisplay = this.toggleIntroDisplay.bind(this);
    }
    getImgUrl(images) {
        const item = images.filter((image) => { return image.scale === 3; })[0];
        let url;
        if (item !== undefined) {
            url = item.url;
        } else {
            url = '';
        }
        return imgPrefix + url;
    }

    toggleIntroDisplay() {
        this.setState({
            introShowAll: !this.state.introShowAll
        });
    }
    flatMap(array, fn) {
        let result = [];
        for (let i = 0; i < array.length; i++) {
            let mapping = fn(array[i], i);
            result = result.concat(mapping);
        }
        return result;
    }
    highlightKeywords(string) {
        if (!string) return '';
        let { keyword } = this.props; // keyword
        let result = this.flatMap(string.split(keyword), function (part, index) {
            return [part, <span key={index} style={{ color: '#FFC31B' }}>{keyword}</span>];
        });
        // Remove the last spacer
        result.pop();
        return (
            <span>
                { result }
            </span>
        );
    }
    getDirector() {
        return this.props.director && this.props.director.length > 15 ? this.props.director.slice(0, 15) + '...' : this.props.director;
    }
    getIntro() {
        return this.props.intro && this.props.intro.length > this.introLimit && !this.state.introShowAll ? this.props.intro.slice(0, this.introLimit) + '...' : this.props.intro;
    }
    render() {
        return (
            <article className={cn(classNames['item'], 'clearfix')}>
                <div className={classNames['img-wrap']}>
                    <img src={ this.props.images && this.props.images.length > 0 && this.props.images.filter((image, index) => image.scale == 3).length > 0 && this.getImgUrl(this.props.images) || '../../static/image/search/item-default-img.png'}/>
                    {this.props.clarity && <div className={classNames['clarity']}>{this.props.clarity}</div>}
                    {this.props.sign && <div className={classNames['sign']}>{this.props.sign}</div>}
                    {this.props.updateEpisode && <div className={classNames['update-episode']}>{this.props.updateEpisode}</div>}
                </div>
                <div className={classNames['text-wrap']}>
                    <p className={classNames['name-type']}>
                        <span className={classNames['name']}>{ this.highlightKeywords(this.props.name) }</span>
                        <span className={classNames['type']}>{ this.props.bizType }</span>
                    </p>
                    {this.props.director && <p className={classNames['director']}>导演：{ this.highlightKeywords(this.getDirector()) }</p>}
                    <p className={classNames['year']}>年代：{ this.props.year }</p>
                    <p className={classNames['area']}>地区：{ this.props.area || '-' }</p>
                    <p className={classNames['type']}>类型：{ this.props.realType || '-' }</p>
                    <p className={classNames['actor']}>演员：{ this.props.actor || '-' }</p>
                    <p className={classNames['intro']}>
                        <span className={classNames['label']}>简介：</span>{ this.highlightKeywords(this.getIntro()) || '-' }
                        <span className={classNames['exp-col']} onClick={this.toggleIntroDisplay}>{this.props.intro.length > this.introLimit ? this.state.introShowAll ? '收起' : '展开' : ''}</span>
                    </p>
                    <Link as={`/play/${this.props.videoBaseId}`} href={{ pathname: '/play', query: { baseId: this.props.videoBaseId, from: 'search' }}}>
                        <a className={classNames['play-btn']}>
                            <i className={cn('iconfont', 'icon-play', classNames['play-icon'])}></i>无广告免费播放
                        </a>
                    </Link>
                </div>
            </article>
        );
    }
}

export default Item;
