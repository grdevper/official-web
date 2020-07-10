const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./config');
const glob = require('glob');
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: (pages => {
    let entry = {};
    pages.forEach(page => {
      const list = page.split(/[\/|\/\/|\\|\\\\]/g); // eslint-disable-line
      const key = list[list.length - 1].replace(/\.js/g, '');
      const folder = /\/views\/pc\//.test(page) ? 'pc' : 'mobile';
      entry[`${folder}/${key}`] = isDev ? [page, 'webpack-hot-middleware/client?reload=true'] : page;
    });
    return entry;
  })(glob.sync(resolve(__dirname, '../client/**/*/*.js'))),

  output: {
    path: resolve(__dirname, `../${config.path.public}`),
    publicPath: config.path.public,
    filename: `${config.dir.chunk}/[name].js`,
    chunkFilename: `${config.dir.chunk}/[name].[chunkhash].js`
  },

  resolve: {
    alias: {

    }
  },

  module: {
    rules: [
        {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /(node_modules|lib|libs)/
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        name: '[name].[hash:5].[ext]',
                        limit: 1000,
                        outputPath: config.dir.img
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        disable: process.env.NODE_ENV !== 'production',
                        pngquant: {
                            quality: '80'
                        }
                    }
                }
            ]
        },
        {
            test: /\.(eot|woff2|woff|ttf|svg)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        outputPath: config.dir.font
                    }
                },
                {
                    loader: 'url-loader'
                }
            ]
        },
        {
            test: /\.html$/,
            use: [
                {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'img:data-src', ':data-background']
                    }
                }
            ]
        },
        {
            test: /\.ejs$/,
            use: [
                {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'img:data-src', ':data-background']
                    }
                },
                {
                    loader: 'ejs-html-loader',
                    options: {
                        production: process.env.ENV === 'production'
                    }
                }
            ]
        }
    ]
},

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        // 打包文件
        ...glob.sync(resolve(__dirname, '../client/views/**/*.ejs')).map((filepath, i) => {
            const tempList = filepath.split(/[\/|\/\/|\\|\\\\]/g); // eslint-disable-line
            // 读取 CONFIG.EXT 文件自定义的文件后缀名，默认生成 ejs 文件，可以定义生成 html 文件
            const folder = /\/views\/pc\//.test(filepath) ? 'pc' : 'mobile';
            const filename = (name => `${name.split('.')[0]}.${config.extensions}`)(`${config.dir.chunk}/${folder}/${tempList[tempList.length - 1]}`)
            const template = filepath
            const fileChunk = filename.split('.')[0].split(/[\/|\/\/|\\|\\\\]/g).pop() // eslint-disable-line
            const chunks = isDev ? [ fileChunk ] : ['manifest', 'vendors', fileChunk]
            return new HtmlWebpackPlugin({ filename, template, chunks })
        })
    ]
};
