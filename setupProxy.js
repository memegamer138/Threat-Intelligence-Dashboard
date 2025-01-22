const { createProxyMiddleware } = require('http-proxy-middleware');

modules.exports = function(app) {
    app.use(
        '/v1/query',
        createProxyMiddleware({
            target: 'https://api.osv.dev',
            changeOrigin: true,
        })
    );
}