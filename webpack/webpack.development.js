const commonConfig = require('./webpack.dev.js');

commonConfig.devServer.proxy[0].target = 'https://dev.job-room.ch:8443';

module.exports = commonConfig;
