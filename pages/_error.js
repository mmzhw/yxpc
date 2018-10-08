import React from 'react';

const styles = {
    bg: {
        textAlign: 'center',
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        backgroundColor: '#222'
    },
    logo: {
        marginTop: '111px',
        width: '134px'
    },
    errorCode: {
        width: '105px'
    },
    btn: {
        width: '50px',
        height: '25px',
        background: '#FABE00',
        borderRadius: '43px',
        textDecoration: 'none',
        color: '#222',
        padding: '4px 13px',
        margin: '0 5px',
    },
    text: {
        marginTop: '65px',
        color: '#CFCFCF',
        fontSiz: '12px'
    },
};

export default class Error extends React.Component {
    static getInitialProps({ res, err }) {
        const statusCode = res ? res.statusCode : err ? err.statusCode : null;
        return { statusCode };
    }

    render() {
        return (
            <div style={styles.bg}>
                <img style={styles.logo} src='../static/image/logo-error.png' alt='' />
                {this.props.statusCode === 404 ? (
                    <div>
                        <img style={styles.errorCode} src='../static/image/404.png' alt='' />
                        <p style={styles.text}>唔……它不见了呢～去<a style={styles.btn} href='/'>首页</a>看看？</p>
                    </div>
                ) : (
                    <div>
                        <img style={styles.errorCode} src='../static/image/500.png' alt='' />
                        <p style={styles.text}>唔……服务器开小差了～尝试<a style={styles.btn} href='javascript:window.location.reload();'>刷新</a>一下吧？</p>
                    </div>
                )}
            </div>
        );
    }
}
