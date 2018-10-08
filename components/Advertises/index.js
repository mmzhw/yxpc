import React from 'react';
import classNames from './style.css';
import Proptypes from 'prop-types';
import { handleImgUrl } from '../../utils/handleUrl';

const Advertise = (props) => {
    const imgUrl = handleImgUrl(props.src);
    return (
        <a className={classNames['advertise']} href={props.url} target='_blank'>
            <img src={imgUrl} height='120' style={{ width: '100%' }} />
        </a>
    );
};

Advertise.Proptypes = {
    url: Proptypes.string,
    src: Proptypes.string
};

export default Advertise;
