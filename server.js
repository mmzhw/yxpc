const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const BrowserDetect = require('browser-detect');

const customs = [
    '/', '/homepage',
    '/channel/:channelId', '/channel/:channelId/:secondChannelId',
    '/search', '/search/:q',
    '/play', '/play/:baseId', '/play/:baseId/:detailId',
    '/about',
    '/screen', '/screen/:q',
    '/subject', '/subject/:baseId', '/subject/:baseId/:detailId',
    '/activity', '/activity/:activityId',
    // '/yearSubject', '/yearSubject/:activityId',
    '/yearSubject/:activityId',
    '/ielow'
];

app.prepare()
    .then(() => {
        const server = new Koa();
        const router = new Router();

        customs.forEach((custom) => {
            router.get(custom, async (ctx) => {
                if (BrowserDetect(ctx.req.headers['user-agent']).name === 'ie' && BrowserDetect(ctx.req.headers['user-agent']).versionNumber <= 9) {
                    ctx.redirect('/ielow');
                }
                let arrIds = custom.split('/');
                arrIds = arrIds.filter(arrId => {
                    return arrId !== '';
                });
                let queryParams = {};

                arrIds.forEach((arrId, index) => {
                    if (arrId !== '' && arrId.match(':')) {
                        let newArrId = arrId.replace(':', '');
                        queryParams[newArrId] = ctx.params[newArrId];
                    }
                });
                let actualPage = '/index';
                if (arrIds.length > 0) {
                    actualPage = '/' + arrIds[0];
                }
                await app.render(ctx.req, ctx.res, actualPage, queryParams);
            });
        });

        router.get('*', async (ctx) => {
            await handle(ctx.req, ctx.res);
        });

        server.use(async (ctx, next) => {
            ctx.res.statusCode = 200;
            await next();
        });

        server.listen(5677, (err) => {
            if (err) throw err;
            console.log('> Ready on http://localhost:5677');
        });

        server.use(router.routes());
    })
    .catch((ex) => {
        console.error(ex.stack);
        process.exit(1);
    });
