const path = require('path');
module.exports = {
    mode: 'development',
    entry: {
        app: './index.ts'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist',
        filename: 'index.js'
        // filename: '[name].js'
    },    
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js',],
    },
    devServer: {
        port: 9000,
        hot: true,
        static: {
            // directory: path.join(__dirname, "../dist"),
            directory: path.resolve(__dirname, "../"),
            serveIndex: true,
            publicPath: '/',
        },
    },
};
