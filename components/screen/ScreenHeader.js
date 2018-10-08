import React, { Component } from 'react';
import cn from 'classnames';

import classNames from './screenHeader.css';

class ScreenHeader extends Component {
    render() {
        const { conditions } = this.props;
        return (
            <div>
                <div className={classNames['condition-wrap']}>
                    {
                        conditions.length > 0
                            ? conditions.map((item, index) => {
                                return (
                                    <div key={index} className={classNames['single-condition']}>
                                        <span>{item.title.name}：</span>
                                        <ul>
                                            {item.content && item.content.slice(0, item.showItemAll ? item.content.length : 10).map(data => {
                                                // 动态设置类名
                                                let className = cn({
                                                    [classNames['list-item']]: true,
                                                    [classNames['list-item-active']]: item.activeKey === data.key
                                                });
                                                return (
                                                    <li
                                                        key={data.key}
                                                        className={className}
                                                        onClick={() => this.props.setSearchCondition(item.title.key, data.key)}
                                                    >
                                                        {data.name.length > 6 ? data.name.slice(0, 6) + '...' : data.name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <span
                                            style={{ display: item.content.length < 10 && 'none' }}
                                            className={classNames['more']}
                                            onClick={() => this.props.changeConditionItemCount(item.title.key)}
                                        >
                                            {!item.showItemAll && item.content.length > 9 ? '更多' : '收起'}
                                        </span>
                                    </div>
                                );
                            })
                            : null
                    }
                </div>
            </div>
        );
    }
}

export default ScreenHeader;
