import React from 'react';
import propTypes from 'prop-types';
import Link from 'next/link';
import classNames from './style.css';
import { handleImgUrl } from '../../../utils/handleUrl';

const SubVideoHeader = (props) => {
    const isActivityPage = props.model;
    const isImageTitle = isActivityPage && props.model.titleStyleType === 1;
    const headerStyle = {
        width: isActivityPage
            ? isImageTitle
                ? '100%' : '1180px'
            : '100%'
    }
    return (
        <div className={classNames['subHeader']} style={headerStyle}>
            {
                props.model && props.model.titleStyleType ? (
                    <div className={classNames['img-title']}>
                        <img src={handleImgUrl(props.model.imgTitleStyleUrl)} />
                    </div>
                ) : (
                    props.showMoreHref ? (
                        <a className={classNames['subVideoName']} href={props.showMoreHref}>{props.subVideoName}</a>
                    ) : (
                        <a className={classNames['subVideoName']}>{props.subVideoName}</a>
                    )
                )
            }
            {
                props.showMoreHref && <a className={classNames['hasMore']} href={props.showMoreHref}></a>
            }
            <ul style={{ paddingTop: props.citys && props.citys.secoundChannels ? '14px' : '0' }}>
                {
                    props.citys && props.citys.secoundChannels && props.citys.secoundChannels.map((city, index) => {
                        let iClass = index === props.citys.secoundChannels.length - 1 ? 'arr' : 'spot';
                        return (
                            <li key={index}>
                                <Link key={index} as={`/channel/${props.citys.id}/${city.id}`} href={{ pathname: '/channel', query: { channelId: props.citys.id, secondChannelId: city.id } }}><a>{city.name}</a></Link>
                                <i className={classNames[iClass]}></i>
                            </li>);
                    })
                }
                <div className={classNames['clear']}></div>
            </ul>
            <div className={classNames['clear']}></div>
        </div>
    );
};

SubVideoHeader.propTypes = {
    subVideoName: propTypes.string,
    categories: propTypes.array,
    showMoreHref: propTypes.string
};

export default SubVideoHeader;
