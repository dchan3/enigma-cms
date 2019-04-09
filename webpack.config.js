const path = require('path'), webpack = require('webpack'),
  nodeExternals = require('webpack-node-externals')

module.exports = [{
  entry:  './src/client/app/index.js',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: 'true'
    })
  ],
  output: {
    path: path.resolve( __dirname, 'public' ),
    publicPath: path.resolve( __dirname, 'public' ),
    filename: 'app.bundle.js',
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js'
    }
  }
}, {
  entry: './src/server/server.js',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: 'false'
    })
  ],
  output: {
    path: __dirname,
    filename: 'server.bundle.js',
    publicPath: '/'
  }
}];
