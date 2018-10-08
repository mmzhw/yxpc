/* eslint-disable */
import React from 'react';
import classNames from './style.css';

const SubVideoContent = (props) => (
    <div>
        <span className={classNames['video-item-line']}>
          {props.children}
        </span>
    </div>
);

export default SubVideoContent
