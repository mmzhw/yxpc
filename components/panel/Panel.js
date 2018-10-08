import React, { Component } from 'react';
import classNames from './panel.css';
import cn from 'classnames';
import { handleImgUrl } from '../../utils/handleUrl';

class Panel extends Component {
    handleImg(images) {
        let url;
        images.forEach((item) => {
            if (item.scale === 1) {
                url = item.url;
            }
        });
        return handleImgUrl(url);
    }

    render() {
        return (
            <div className='right-panel-wrap'>
                <div className={cn(classNames['panel-wrap'], 'right-panel', { [classNames['panel-wrap-fold']]: this.props.isFold, [classNames['panel-full']]: this.props.isPanelFullDisplay, [classNames['panel-full-uncollapsed']]: !this.props.isPanelCollapsed })}>
                    {
                        this.props.isPanelFullDisplay ? null : <div className={classNames['panel-fold']} onClick={this.props.foldPanel}>
                            <i></i>
                        </div>
                    }
                    <div className={classNames['panel-title-wrap']}>
                        <h2>{this.props.videoInfo.name}</h2>
                        {
                            this.props.videoInfo.bizType === 0 || this.props.videoInfo.bizType === 3 ? (
                                <div className={classNames['panel-title-intro']}>
                                    <img src={this.handleImg(this.props.videoInfo.images)} />
                                    <div className={classNames['panel-title-name']}>
                                        <span>{this.props.videoInfo.name}</span>
                                        <p>{this.props.videoInfo.intro}</p>
                                    </div>
                                </div>
                            ) : null
                        }

                        {/* <span>选集</span>*/}
                    </div>
                    <div className={classNames['panel-body']}>
                        {
                            this.props.videoInfo.bizType === 1 ? <ul className={classNames['panel-serial-ul']}>
                                {
                                    this.props.videoInfo.vVideoDetailRspVos.map((item, index) => {
                                        return <li className={cn(classNames['panel-serial'], { [classNames['panel-serial-active']]: index === this.props.videoInfo.currentIndex })} onClick={this.props.goToVideo.bind(null, item.videoBaseId, item.videoDetailId, index)} key={index}>{item.episodeDisplay}</li>;
                                    })
                                }
                            </ul> : null
                        }
                        {
                            this.props.videoInfo.bizType === 2 ? <ul>
                                {
                                    this.props.videoInfo.vVideoDetailRspVos.map((item, index) => {
                                        return <li className={cn(classNames['panel-variety'], { [classNames['panel-variety-active']]: index === this.props.videoInfo.currentIndex })} onClick={this.props.goToVideo.bind(null, item.videoBaseId, item.videoDetailId, index)} key={index}>
                                            <div className={classNames['panel-variety-img']}>
                                                {
                                                    item.images.length > 0 ? (
                                                        <img src={this.handleImg(item.images)} />
                                                    ) : (<img src='../../../static/image/video-cover-180x102.png' />)
                                                }
                                                <span>{item.episodeDisplay}</span>
                                            </div>
                                            <p>{item.title}</p>
                                        </li>;
                                    })
                                }
                            </ul> : null
                        }
                    </div>
                </div> : null
            </div>
        );
    }
}

export default Panel;
