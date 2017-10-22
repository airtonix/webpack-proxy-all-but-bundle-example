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

          // never gets used. proxy won't use bypass or router if this isn't defined.
          target: 'http://localhost/backend/',

          /**
           * Route the request onto a specified host
           * @param {http.request} request 
           * @returns {string} 'scheme://host[:port]/' to forward requests to.
           */
          router (request) {
              const {host} = request.headers;

              // in our case we just want to change the port
              // But you could do table lookups, pathname tests, time of day... whatever
              // return value has to be of the format: 'scheme://host:port'
              const target = `http://${host.replace(`:${env.port}`, `5000`)}`;

              log('proxy.router', {host, target});

              return target;
          },

          /**
           * 
           * @param {http.request} request 
           * @param {http.response} response 
           * @param {Object} options devServer.proxy object
           * @returns {String|Boolean} Falsey to continue proxy behaviour, pathname to serve from webpack dev server.
           */
          bypass (request, response, options) {
              // test if request.path is for something webpack-dev-server would serve.
              // otherwise return false, meaning we keep going through proxy to the backend.
              const asset = request.path;

              // yesno if the requested path is one of the following.
              const byPass = [
                  env.public,
                  '/webpack-dev-server/',
                  '/sockjs-node',
                  '/socket.io/',
              ].find(pattern => asset.indexOf(pattern) >= 0 ) !== undefined;
              
              log('proxy.bypass', {byPass, asset});

              // if it's a webpack asset then we bypass the proxy, otherwise continue on to
              // devServer.proxy.router
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