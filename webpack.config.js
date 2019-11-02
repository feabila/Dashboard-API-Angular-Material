const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src/app/'),
        }
    },
    module: {
        rules: [
            {test: /\.ts$/, use: ['ts-loader', 'angular2-template-loader']},
            {test: /\.html$/, use: 'html-loader'},
            {test: /\.less$/, use: ['to-string-loader', 'style-loader', 'css-loader', 'less-loader']},
            {test: /\.scss$/, use: ['to-string-loader', 'style-loader', 'css-loader', 'sass-loader']},
            {test: /[\/\\]@angular[\/\\].+\.js$/, parser: { system: true }}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new webpack.DefinePlugin({
            // global app config object
            config: JSON.stringify({
                apiUrl: 'http://localhost:4000'
            })
        }),

        // workaround for warning: Critical dependency: the request of a dependency is an expression
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)fesm5/,
            path.resolve(__dirname, 'src')
        )
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: true
    },
    devServer: {
        historyApiFallback: true
    }
}