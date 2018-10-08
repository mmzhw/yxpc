const withCSS = require('@zeit/next-css');

module.exports = withCSS({
    cssModules: true,
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: '[local]___[hash:base64:5]',
    },
    webpack: (config) => {
        // Unshift polyfills in main entrypoint.
        const originalEntry = config.entry;
        config.entry = async () => {
            const entries = await originalEntry();
            if (entries['main.js']) {
                entries['main.js'].unshift('./polyfills.js');
            }
            return entries;
        };

        return config;
    }
});
