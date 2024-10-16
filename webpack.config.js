import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    devtool: 'source-map',
    entry: {
        main: './logic/main.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'logic/dist'),
        publicPath: '/logic/dist/',
    },
    mode: 'production',
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
