const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const prodConfig = require('./webpack.prod.js'); // the settings that are common to prod and dev
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = webpackMerge(prodConfig, {
    plugins:[
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            defaultSizes: "gzip",
            openAnalyzer: false,
        }),
    ]
});