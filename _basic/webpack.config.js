
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

const OUTPUT_FOLDER = './dist';

module.exports = () => {
  const plugins = [
    new CleanWebpackPlugin([OUTPUT_FOLDER], {  watch: false }),
    new HtmlWebpackPlugin({
      template: './app/index.html',
    }),
  ];
  return {
    entry: {
      client: './app/app.js',
    },
    output: {
      filename: '[name].[chunkhash].js',
      path: path.join(__dirname, OUTPUT_FOLDER),
      chunkFilename: '[name].[chunkhash].js',
    },
    plugins,
    module: {

    },
  };
}
