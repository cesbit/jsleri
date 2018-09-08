/* global require, __dirname, module, process */
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const VERSION = require(path.resolve(__dirname, './package.json')).version;

const filename = process.env.NODE_ENV === 'production'
    ? `jsleri-${VERSION}.min.js`
    : `jsleri-${VERSION}.js`;

const config = {
    mode: 'production',
    entry: './jsleri.js',
    output: {
        filename,
        path: path.resolve(__dirname, './dist'),
        library: 'jsleri',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'VERSION': JSON.stringify(VERSION),
            },
        }),
    ],
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: true
                    }
                }
            })
        ]
    }
};

module.exports = config;