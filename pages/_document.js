// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <html>
                <Head>
                    <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
                    <meta name='renderer' content='webkit' />
                    <link rel='shortcut icon' href='/static/image/logo.png' type='image/x-icon' />
                    <link rel='stylesheet' href='/_next/static/style.css' />

                    <link href='/static/css/style.css' rel='stylesheet'/>
                    <link href='/static/css/iconfont.css' rel='stylesheet'/>
                    <link href='/static/css/swiper.min.css' rel='stylesheet'/>
                    <link href='/static/css/video-js.min.css' rel='stylesheet'/>
                    <link href='/static/css/jc-player.css' rel='stylesheet'/>

                    <script src='/static/js/swiper.min.js'/>
                    <script src='/static/js/videojs-ie8.min.js'/>
                    <script src='/static/js/video.min.js'/>
                    <script src='/static/js/videojs-contrib-hls.min.js'/>
                    <script src='/static/js/videojs-flash.min.js'/>
                    <script src='/static/js/videojs.hotkeys.min.js'/>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
                <script dangerouslySetInnerHTML={{
                    __html: `var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?947e6edc453c6772f1377d9d3b335c29";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();`
                }}/>
                <script
                    dangerouslySetInnerHTML={{ __html: ` var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1271658313'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s19.cnzz.com/z_stat.php%3Fid%3D1271658313' type='text/javascript'%3E%3C/script%3E"));document.getElementById('cnzz_stat_icon_1271658313').style.display='none';` }}/>

            </html>
        );
    }
}
