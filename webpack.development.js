const merge = require('webpack-merge');
const common = require('./webpack.common');
const Webpack = require('webpack');
var ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = merge(common, {
  entry: ['webpack-hot-middleware/client'],
  plugins: [new Webpack.HotModuleReplacementPlugin(),
  new ImageminPlugin({
      disable: false, // Disable during development
      pngquant: {
        quality: '45'
      },
      jpegtran: { optimizationLevel: 6 }
    })],
});
