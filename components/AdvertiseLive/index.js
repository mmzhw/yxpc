import React from 'react';
import classNames from './style.css';
import { handleImgUrl } from '../../utils/handleUrl';
const sortOrder = (a, b) => a.adType - b.adType;
const Advertise = (props) => {
    const { allData, adlayoutId } = props;
    let advertiseWidth = { flex: 1 }, style = {};
    const needData = adlayoutId == 1 ? allData.filter((item) => item.adType == 0).filter((item, index) => index < 1) : allData.length < 2 ? (function() { advertiseWidth = { width: '50%' }; return allData.filter((item) => item.adType != 0); })() : (function() { style = { display: 'flex' }; return allData.sort(sortOrder).filter((item) => item.adType != 0).filter((item, index) => index < 2); })();
    return (
        <div className={classNames['advertise_box']} style={style}>
            {needData.map((item, index) => {
                if (item.imageUrlPc) {
                    return (
                        <a key={index} className={classNames['advertise']} style={advertiseWidth} href={handleImgUrl(item.contentUrl)} target='_blank'>
                            <img src={handleImgUrl(item.imageUrlPc)} height='120' style={{ width: '100%' }} />
                        </a>
                    );
                }
            })}
        </div>
    );
};
export default Advertise;
