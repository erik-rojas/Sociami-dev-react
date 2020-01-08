let path = require('path');
let webpack = require('webpack');
let express = require('express');
let fs = require('fs');
let config = require('./webpack.local');

const env = process.env.SOQQLE_ENV || 'development';

const configFile = `./webpack.${env}.js`;
if (fs.existsSync(configFile)) {
  config = require(configFile);
}

let app = express();
let compiler = webpack(config);

let port = env == 'staging' ? 8080 : 3000;

app.use(
  require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
  }),
);

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:' + port + '/');
});
