import { withRouter } from 'next/router';

const WrapToPlay = ({ children, router, href, as, style }) => {
    const handleClick = (e) => {
        e.preventDefault();
        router.push(href, as);
    };

    return (
        <a href={href} onClick={handleClick} style={style}>
            {children}
        </a>
    );
};

export default withRouter(WrapToPlay);
