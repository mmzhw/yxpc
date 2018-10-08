import classNames from './noResult.css';

const NoResult = (props) => (
    <div className={classNames['no-search-results-wrap']}>
        <img src='/static/image/search/no-search-results.png' />
        <p className={classNames['no-results-msg']}>好像什么都没有QAQ...换个词儿试试？</p>
    </div>
);

export default NoResult;
