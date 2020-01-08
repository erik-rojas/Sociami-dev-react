const merge = require('webpack-merge');
const common = require('./webpack.common');
const build = require('./webpack.build');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ImageminPlugin = require('imagemin-webpack-plugin').default;
let Path = require('path');

module.exports = merge(common, build, {
  plugins: [
    // don't mess with NODE_ENV=production. It is predefined value
    // used by webpack and react. Unless migrate to webpack 4
    // where mode option introduced
    new Webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      SOQQLE_ENV: 'staging',
    }),
    new Webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),
    new HtmlWebpackPlugin({
      template: Path.join(__dirname, 'src/index.ejs'),
      mp_token: '"d7a0113338adc33892f32d3cd488d02a"',
      title: 'Soqqle',
      inject: 'body',
    }),
  new ImageminPlugin({
      disable: false, // Disable during development
      pngquant: {
        quality: '40'
      },
      jpegtran: { optimizationLevel: 6 }
    }),
  ],
});
