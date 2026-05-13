/* global process */
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'production',
    entry: './jsleri.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: process.env.NODE_ENV === 'production' ? 'jsleri.min.js' : 'jsleri.js',
        library: 'jsleri',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.js/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 5,
                },
            }),
        ]
    }
};
