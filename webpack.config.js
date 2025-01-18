import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    devtool: 'source-map',
    entry: {
        game: './logic/game/main.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'logic/'),
    },
    mode: 'production',
    watch: false,
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
