const merge = require('webpack-merge');
const development = require('./webpack.development');
const Webpack = require('webpack');

module.exports = merge(development, {
  plugins: [
    new Webpack.EnvironmentPlugin({
      SOQQLE_ENV: 'local',
    }),
  ],
});
