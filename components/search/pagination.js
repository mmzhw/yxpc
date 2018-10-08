import React, { Component } from 'react';
import classNames from './pagination.css';
import cn from 'classnames';

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderLength: 10,
        };
    }

    onPageChange(page) {
        if (this.props.onPageChange) {
            if (page > this.props.totalPage) {
                this.props.onPageChange(this.props.totalPage);
                return;
            } else if (page < 1) {
                this.props.onPageChange(1);
                return;
            }
            this.props.onPageChange(page);
        }
    }

    renderLi(page) {
        const { currentPage, totalPage } = this.props;
        let className = cn(classNames['circle']);
        if (page === this.props.currentPage) {
            className = cn(classNames['circle'], classNames['active']);
        }
        // --- 总页数小于10 ---
        if (totalPage <= 10) {
            return (
                <li key={page} className={className} onClick={this.onPageChange.bind(this, page)}>
                    {page}
                </li>
            );
        }
        // --- 总页数大于10 ---
        if (page === 1 || page === totalPage) { // 第一页或最后一页
            return (
                <li key={page} className={className} onClick={this.onPageChange.bind(this, page)}>
                    {page}
                </li>
            );
        }
        if (currentPage >= 1 && currentPage < 4) { // 当前页为1或2或3
            if (page === 6) {
                return (
                    <li key={page} className={className}
                        onClick={this.onPageChange.bind(this, currentPage + 5)}>...</li>
                );
            } else if (page > 6) {
                return '';
            }
        }
        if (currentPage > totalPage - 3 && currentPage <= totalPage) { // 当前页为11或12或13
            if (page === totalPage - 5) {
                return (
                    <li key={page} className={className}
                        onClick={this.onPageChange.bind(this, currentPage - 5)}>...</li>
                );
            } else if (page < totalPage - 5) {
                return '';
            }
        }
        if (currentPage >= 4 && currentPage <= totalPage - 3) {
            if (page === currentPage - 3 || page === currentPage + 3) {
                if (page === currentPage - 3) {
                    return (
                        <li key={page} className={className}
                            onClick={this.onPageChange.bind(this, currentPage - 5)}>...</li>
                    );
                } else {
                    return (
                        <li key={page} className={className}
                            onClick={this.onPageChange.bind(this, currentPage + 5)}>...</li>
                    );
                }
            } else {
                if (page < currentPage - 3 || page > currentPage + 3) {
                    return '';
                }
            }
        }
        return (
            <li key={page} className={className} onClick={this.onPageChange.bind(this, page)}>
                {page}
            </li>
        );
    }

    render() {
        return (
            <ul className={classNames['pagination']}>

                <li className={classNames['circle']} onClick={this.onPageChange.bind(this, this.props.currentPage - 1)}>上一页</li>
                {
                    Array.from(Array(this.props.totalPage), (v, k) => k).map((item, index) => {
                        return this.renderLi(index + 1);
                    })
                }
                <li className={classNames['circle']} onClick={this.onPageChange.bind(this, this.props.currentPage + 1)}>下一页</li>
            </ul>
        );
    }
}

export default Pagination;
