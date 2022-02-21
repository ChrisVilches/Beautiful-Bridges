const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  optimization: {
    minimize: false
  },
  plugins: [
    new BundleAnalyzerPlugin()
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    hot: true,
    compress: true,
    port: 3000
  }
})
