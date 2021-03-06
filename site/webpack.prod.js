const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const marked = require("marked");
const renderer = new marked.Renderer();
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

process.env.NODE_ENV = 'production';
const fs = require('fs');

const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, '../theme.less'), 'utf8'));

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, './index.js'),
    ]
  },
  output: {
    path: path.resolve(__dirname, "../public"),
    publicPath: '/',
    filename: "[name].[chunkhash:6].js",
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "../site")
        ],
        use: [{
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
        }]
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
            loader: 'css-loader'
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
  plugins: [
    new CleanWebpackPlugin([
      path.resolve(__dirname, '../docs/')
    ], {
      root: process.cwd(),
      exclude: ['favicon.ico']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.build.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      filename: '404.html',
      minify: {
        collapseWhitespace: true,
      }
    }),
    new webpack.DefinePlugin({
      BASEPATH: JSON.stringify('/ehdfe-weekly'),
    }),
    new UglifyJSPlugin({

    })
  ],

}