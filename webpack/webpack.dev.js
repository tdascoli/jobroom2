const webpack = require('webpack');
const writeFilePlugin = require('write-file-webpack-plugin');
const webpackMerge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');

const utils = require('./utils.js');
const commonConfig = require('./webpack.common.js');

const ENV = 'development';
const URLS = [
    '/api',
    '/jobservice',
    '/referenceservice',
    '/candidateservice',
    '/jobpublicationservice',
    '/management',
    '/swagger-resources',
    '/v2/api-docs',
    '/h2-console',
    '/auth'
];

const getProxies = (enviroment) => {
    const target = enviroment && enviroment.target ? enviroment.target : 'http://127.0.0.1:8080';
    if (enviroment && enviroment.localUrl && enviroment.localPort) {
        const localUrl = enviroment.localUrl;
        const devUrls = URLS.filter((url) => url !== localUrl);
        return [{
            context: devUrls,
            target: 'http://dev.job-room.ch:8080',
            secure: false
        }, {
            context: [localUrl],
            target: 'http://127.0.0.1:'.concat(enviroment.localPort),
            secure: false,
            pathRewrite: getPathRewrite(localUrl)
        }];
    }

    return [{
        context: URLS,
        target: target,
        secure: false
    }];
};

const getPathRewrite = (url) => {
    const pathRewrite = {};
    pathRewrite['^'.concat(url)] = '';
    return pathRewrite;
};

module.exports = (enviroment) => {
    return webpackMerge(commonConfig({ env: ENV }), {
        devtool: 'eval-source-map',
        devServer: {
            contentBase: './build/www',
            proxy: getProxies(enviroment),
            watchOptions: {
                ignored: /node_modules/
            }
        },
        entry: {
            polyfills: './src/main/webapp/app/polyfills',
            global: './src/main/webapp/content/scss/global.scss',
            main: './src/main/webapp/app/app.main'
        },
        output: {
            path: utils.root('build/www'),
            filename: 'app/[name].bundle.js',
            chunkFilename: 'app/[id].chunk.js'
        },
        module: {
            rules: [{
                test: /\.ts$/,
                enforce: 'pre',
                loaders: 'tslint-loader',
                exclude: ['node_modules', new RegExp('reflect-metadata\\' + path.sep + 'Reflect\\.ts')]
            },
                {
                    test: /\.ts$/,
                    loaders: [
                        'angular2-template-loader',
                        'awesome-typescript-loader'
                    ],
                    exclude: ['node_modules/generator-jhipster']
                },
                {
                    test: /\.scss$/,
                    loaders: ['to-string-loader', 'css-loader', 'sass-loader'],
                    exclude: /(vendor\.scss|global\.scss)/
                },
                {
                    test: /(vendor\.scss|global\.scss)/,
                    loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
                },
                {
                    test: /\.css$/,
                    loaders: ['to-string-loader', 'css-loader'],
                    exclude: /(vendor\.css|global\.css)/
                },
                {
                    test: /(vendor\.css|global\.css)/,
                    loaders: ['style-loader', 'css-loader']
                }]
        },
        plugins: [
            new BrowserSyncPlugin({
                host: 'localhost',
                port: 9000,
                proxy: {
                    target: 'http://localhost:9060'
                }
            }, {
                reload: false
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.NamedModulesPlugin(),
            new writeFilePlugin(),
            new webpack.WatchIgnorePlugin([
                utils.root('src/test'),
            ]),
            new WebpackNotifierPlugin({
                title: 'JHipster',
                contentImage: path.join(__dirname, 'logo-jhipster.png')
            })
        ]
    });
}
