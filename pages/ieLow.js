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

export default class IeLow extends React.Component {
    render() {
        return (
            <div style={styles.bg}>
                <img style={styles.logo} src='../static/image/logo-error.png' alt='' />
                <div>
                    <p style={styles.text}>当前浏览器版本过低，下载<a style={styles.btn} href='http://dx-downloads-test.itangchao.me/ChromeStandaloneSetup.exe'>高级浏览器</a>获得更好的体验</p>
                </div>
            </div>
        );
    }
}
