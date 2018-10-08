import React, { Component } from 'react';
import Link from 'next/link';
import getLink from '../../components/subject/getLink.js';
import classNames from './selectWork.css';
import cn from 'classnames';

class TvSeries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPage: 0, // 总页数
            nowIndex: 0, // 当前页数
            worknum: [], // 页数列表
            openList: [], // 当前展示的列表
        };
    }
    componentDidMount() {
        this.getGroup(this.props.workList.length, this.props.pageSize);
    }
    getNumPage(index) {
        const { totalPage } = this.state;
        const { workList, pageSize } = this.props;
        let openList = [];
        if (totalPage === 1) return;
        if (index === 0) {
            openList = workList.slice(index, (index + 1) * pageSize);
        } else {
            openList = workList.slice(index * pageSize, (index + 1) * pageSize);
        }
        this.setState({ openList, nowIndex: index });
    }
    // 计算初始有多少页
    getGroup(totalItem, pageSize) {
        const totalPage = Math.ceil(Number(totalItem) / Number(pageSize));
        this.setState({ totalPage });
        let worknum = [], openList = [];
        // console.log(totalItem)
        if (!totalPage || totalPage === 0) return (this.setState({ worknum: ['暂无'] }));
        if (totalPage === 1) {
            worknum.push(`1-${totalItem}`);
            openList = this.props.workList.slice(0, totalItem);
        } else if (totalPage > 1) {
            for (let i = 0; i < totalPage; i++) {
                if (i < totalPage - 1) {
                    worknum.push(`${i * pageSize + 1}-${(i + 1) * pageSize}`);
                }
                if (i === totalPage - 1) {
                    worknum.push(`${i * pageSize + 1}-${totalItem}`);
                }
            }
            openList = this.props.workList.slice(0, pageSize);
        }
        this.setState({ worknum, openList });
    }
    render() {
        const { worknum, openList } = this.state;
        return (
            <article className={cn(classNames['wrapper'], 'clearfix')}>
                <div className={classNames['tv-select']}>
                    <div className={classNames['select-work']}>
                        <span>选集</span>
                        <ul className={cn(classNames['select-ul'], 'clearfix')}>
                            {
                                worknum && worknum.map((item, index) => {
                                    let curr = index === this.state.nowIndex ? classNames['active'] : '';
                                    return (
                                        <li key={index} className={curr} onClick={this.getNumPage.bind(this, index)}>
                                            {item}
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </div>
                <ul className={cn(classNames['tv-num'], 'clearfix')}>
                    {
                        openList && openList.map((item, index) => {
                            let linkProps = getLink(item);
                            return (
                                <li key={index} className={classNames['select-num']}>
                                    <Link {...linkProps}>
                                        <a>{item.episode}</a>
                                    </Link>
                                </li>
                            );
                        })
                    }
                </ul>
            </article>
        );
    }
}

export default TvSeries;
