const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInjector = require('html-webpack-injector')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    app: path.join(__dirname, 'src', 'app.js'),
    worker: path.join(__dirname, 'src', 'worker.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  resolve: {
    alias: {
      Samples: path.join(__dirname, 'assets', 'samples'),
      Textures: path.join(__dirname, 'assets', 'textures')
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: './index.html',
      chunks: ['app'],
      hash: true
    }),
    new HtmlWebpackInjector()
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  }
}
