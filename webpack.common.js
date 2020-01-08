let Path = require('path');
let Webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: ['babel-polyfill', './src/index'],
  output: {
    path: Path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: Path.join(__dirname, 'src/index.ejs'),
      title: 'Soqqle | Social Game | Blockchain',
      inject: 'body',
    }),
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['react-hot-loader', 'babel-loader'], include: Path.join(__dirname, 'src') },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, loader: 'url-loader' },
      //{ test: /\.(png|jpg)$/, loader: 'url-loader' },
      { test: /\.(jpg|png|svg)$/, loader: 'file-loader', options: { name: '[path][name].[hash].[ext]' } },
    ],
  },
  resolve: {
    alias: {
      ['~']: Path.resolve(__dirname),
    },
  },
};
