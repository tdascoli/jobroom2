const commonConfig = require('./webpack.dev.js');

commonConfig.devServer.proxy[0].target = 'http://dev.job-room.ch:8080';

module.exports = commonConfig;
