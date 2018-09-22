'use strict';

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

const pathName = 'build';

module.exports = (env, options) => {
  const inDevelopment = options.mode === 'development';

  return {
    context: path.resolve(__dirname, 'src'),

    entry: {
      index: ['./index.js']
    },

    output: {
      path: path.resolve(__dirname, pathName),
      filename: '[name].[chunkhash].js'
    },

    resolve: {
      extensions: ['.js', '.json']
    },

    devtool: inDevelopment ? 'source-map' : false,

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/i,
          exclude: /node_modules/,
          loader: 'eslint-loader'
        },
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },

        {
          test: /\.s?[ac]ss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                minimize: !inDevelopment,
                sourceMap: inDevelopment
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  // stylelint,
                  autoprefixer({
                    browsers: ['ie 11', 'last 2 version'],
                    cascade: false
                  })
                ],
                sourceMap: inDevelopment
              }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },

        {
          test: /\.(php)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[hash].[ext]',
                outputPath: '/'
              }
            }
          ]
        },

        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[hash].[ext]',
                outputPath: 'images/'
              }
            }
          ]
        },

        {
          test: /\.(mp3|ogg|aac|wav|wma)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]-[hash].[ext]',
                outputPath: 'audio/'
              }
            }
          ]
        },

        {
          test: /\.(eot|ttf|woff|woff2)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'fonts/'
            }
          }
        }
      ]
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new CleanWebpackPlugin([pathName], {
        root: __dirname,
        verbose: true,
        dry: false
      }),
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        filename: 'index.html',
        minify: { collapseWhitespace: !inDevelopment }
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].css'
      }),
      new CopyWebpackPlugin([
        // {
        //   from: path.resolve(__dirname, 'projects'),
        //   to: 'projects'
        // },
        // {
        //   from: path.resolve(__dirname, 'src/images'),
        //   to: 'images'
        // }
      ])
    ],

    devServer: {
      host: 'localhost',
      port: 3000,
      open: true
    }
  };
};
