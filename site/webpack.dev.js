const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const marked = require("marked");
const renderer = new marked.Renderer();
const fs = require('fs');

const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, '../theme.less'), 'utf8'));

module.exports = {
    entry:
        // {
        // app: [
        [
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            path.resolve(__dirname, './index.js'),
        ],
    // ]
    // },
    output: {
        path: path.resolve(__dirname, "../public"),
        publicPath: '/',
        filename: "[name].js",
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-router-dom': 'ReactRouterDOM'
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, "../site")
                ],
                use: [
                    'react-hot-loader/webpack',
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["env", 'stage-0', 'react'],
                            plugins: [
                                "syntax-dynamic-import", ["import", {
                                    libraryName: "antd",
                                    style: true
                                }]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            // modules: true,
                            // localIdentName: '[path][name]__[local]--[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            modifyVars: themeVariables
                        }
                    }
                ]
            },
            {
                test: /\.(html)$/,

                use: [{
                    loader: "html-loader",
                }]
            },
            {
                test: /\.(jpg|png|jpeg)$/,
                use: [{
                        loader: 'url-loader',
                        query: {
                            name: 'assets/[name]-[hash:5].[ext]',
                            limit: 60000
                        }
                    }

                ]

            },
            {
                test: /\.md$/,
                use: [{
                        loader: "html-loader"
                    },
                    {
                        loader: "markdown-loader",
                        options: {
                            pedantic: true,
                            renderer
                        }
                    }
                ]

            }
        ],
    },

    resolve: {
        alias: {
            App: path.resolve(__dirname, './app')
        },

    },
    devServer: {
        port: 8080,
        historyApiFallback: {
            rewrites: [{
                from: /^\/article\/.*$/,
                to() {
                    return '/index.html';
                },
            }],
        },
        hot: true,
        publicPath: "http://localhost:8080/",
        proxy:{
            "/upload": "http://localhost:2000"
        }
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            BASEPATH: JSON.stringify('/'),
        })
    ],

}