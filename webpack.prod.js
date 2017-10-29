const Merge = require('webpack-merge');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CommonConfig = require('./webpack.common.js');

module.exports = Merge(CommonConfig, {
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            ie8: false,
            warnings: true,
            mangle: {
                keep_fnames: true
            },
            compress: true,
            output: {
                comments: false
            }
        })
    ]
})