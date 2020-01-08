const Path = require('path');
const Webpack = require('webpack');

module.exports = {
  entry: {
    babelpolyfill: 'babel-polyfill',
    main: './src/index.js',
    vendor: [
      'bluebird',
      'react',
      'react-dom',
      'react-cookie',
      'lodash',
      'redux',
      'axios',
      'moment',
      'react-bootstrap',
      'pubsub-js',
    ],
  },
  output: {
    path: Path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },
  plugins: [
    new Webpack.HashedModuleIdsPlugin(),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
  ],
};
