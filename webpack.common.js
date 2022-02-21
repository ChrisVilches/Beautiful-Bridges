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
      hash: true,
      favicon: path.join(__dirname, 'assets', 'favicon', 'favicon.ico')
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
        test: /\.js$/,
        // TODO: Should it also transpile node_modules? (to make the bundle 100% ES5, not just my src)
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
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
