const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger')
const koaStatic = require('koa-static-server')
const {resolve} = require('path')
const index = require('./routes/index');
const {checkAgent} = require('./util/index');
const webpack = require("webpack")
const webpackConfig = require('../build/webpack.dev.config')
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const config = require('../build/config');
const compiler = webpack(webpackConfig)
const isDev = process.env.NODE_ENV === 'development'
const port = process.env.port || config.port;

if (isDev) {
    // 用 webpack-dev-middleware 启动 webpack 编译
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));

    // 使用 webpack-hot-middleware 支持热更新
    app.use(webpackHotMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true
    }));
} else {
    app.use(views(resolve(__dirname, '../public/chunk'), {
        extension: 'ejs'
    }));
}

app.use(bodyparser());
app.use(json());
app.use(logger());
app.use(koaStatic({rootDir: 'public', rootPath: '/public'}));
app.use(checkAgent)
app.use(index.routes(), index.allowedMethods());

app.listen(port, () => {
    console.log(`Koa is listening in http://localhost:${port}`)
})

module.exports = app
