const path = require('path'), webpack = require('webpack'),
  nodeExternals = require('webpack-node-externals');

module.exports = [{
  mode: process.env.MODE ? process.env.MODE : 'development',
  entry:  './src/client/app/index.js',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
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
      handlebars: path.resolve(__dirname, 'node_modules',
        'handlebars/dist/handlebars.min.js'),
      'styled-components':
        path.resolve(__dirname, 'node_modules', 'styled-components'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
      '@babel': path.resolve(__dirname, 'node_modules', '@babel'),
      'prop-types': path.resolve(__dirname, 'node_modules', 'prop-types'),
    }
  },
  devtool: 'eval-source-map'
}, {
  mode: process.env.MODE ? process.env.MODE : 'development',
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
  },
  devtool: 'eval-source-map',
  node: {
    __dirname: false
  }
}];
