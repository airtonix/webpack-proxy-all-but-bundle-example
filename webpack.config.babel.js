const path = require('path');
const log = require('debug')('webpack.config');

module.exports = (env) => {

  log('env', env);

  return {

    entry: {
      main: [
        './client/main.js',
        './client/main.css'
      ]
    },

    output: {
      publicPath: env.public,
      filename: 'scripts/[name].js',
      path: `${path.resolve('./dist')}/static/theme`
    },

    devServer: {
      hot: true,
      contentBase: './dist',
      port: env.port,
      host: "0.0.0.0",
      proxy: {
        "/": {

          target: 'http://localhost/backend/',

          router (request) {
              const {host} = request.headers;
              const target = `http://${host.replace(`:${env.port}`, ``)}:5000`;
              log('proxy.router', {host, target});
              return target;
          },

          bypass (request, response, options) {
              // test if request.path is for something webpack-dev-server would serve.
              // otherwise return false, meaning we keep going through proxy to the backend.
              const asset = request.path;
              const byPass = [
                  env.public,
                  '/webpack-dev-server/',
                  '/sockjs-node',
                  '/socket.io/',
              ].find(pattern => asset.indexOf(pattern) >= 0 ) !== undefined;
              log('proxy.bypass', {byPass, asset});
              return byPass && request.path;
          }
        },
      }
    },

    module: {
      rules: [
        { test: /\.css$/,
          use: [
            {loader: 'style-loader'},
            {loader: 'css-loader'}
          ]
        }
      ]
    }
  }
};