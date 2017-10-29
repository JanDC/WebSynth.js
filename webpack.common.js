const path = require('path');
const config = require('./config.js');
process.traceDeprecation = true;
const webpackSetup = {
    entry: config.js.entry,
    output: {
        path: config.js.dist,
        filename: '[name].min.js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['src', 'node_modules', 'js/node_modules', 'js/plugins'],
        alias: config.js.aliases,
    },
    node: {
        fs: 'empty'
    },
    externals: [
        'canvas'
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceMap: true,
                        babelrc: false, // disable the default .babelrc file in the current directory, although it works as well without this flag
                        presets: [[require.resolve('babel-preset-es2015'), {"targets": {"browsers": config.support.browsers}, "modules": false, "useBuiltIns": true, "debug": true}]]
                    }
                }
            }
        ]
    },

};

module.exports = webpackSetup;