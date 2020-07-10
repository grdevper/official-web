const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger')
const koaStatic = require('koa-static')
const {resolve} = require('path')
const index = require('./routes/index');
const {checkAgent} = require('./util/index');
const webpack = require("webpack")
const webpackConfig = require('../build/webpack.dev.config')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../build/config');
const compiler = webpack(webpackConfig)
const isDev = process.env.NODE_ENV === 'development'

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

    // 指定开发环境下的静态资源目录
    app.use(koaStatic(resolve(__dirname, '../public')))
} else {
    app.use(views(resolve(__dirname, './views'), {
        extension: 'ejs'
    }));
    app.use(koaStatic(resolve(__dirname, `../${config.dir.chunk}`)))
}
app.use(checkAgent)
app.use(index.routes(), index.allowedMethods());

app.listen(3000, () => {
    console.log('Koa is listening in http://localhost:3000')
})

module.exports = app
