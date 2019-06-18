const path = require('path'), nodeExternals = require('webpack-node-externals'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = [{
  optimization: { minimizer: [new UglifyJsPlugin()] },
  mode: 'production',
  entry:  './src/client/app/index.js',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: true,
          comments: false,
          plugins: ['./babel/hashify']
        }
      },
      {
        test: /\.jsx?$/,
        include: /node_modules|handlebars|react/,
        loader: 'babel-loader',
        options: {
          comments: false
        }
      }
    ]
  },
  output: {
    path: path.resolve( __dirname, 'public' ),
    publicPath: path.resolve( __dirname, 'public' ),
    filename: 'app.bundle.js'
  },
  resolve: {
    alias: {
      handlebars: path.resolve(__dirname, 'node_modules',
        'handlebars/dist/handlebars.min.js'),
      'styled-components':
        path.resolve(__dirname, 'node_modules', 'styled-components'),
      'react': path.resolve(__dirname, 'node_modules', 'react'),
      'prop-types': path.resolve(__dirname, 'node_modules', 'prop-types'),
    }
  },
  devtool: 'source-map'
}, {
  optimization: { minimizer: [new UglifyJsPlugin()] },
  mode: 'production',
  entry: './src/server/server.js',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: true,
          comments: false,
          plugins: ['./babel/hashify']
        }
      },
      {
        test: /\.jsx?$/,
        include: /node_modules|handlebars|react/,
        loader: 'babel-loader',
        options: {
          comments: false
        }
      }
    ],
  },
  output: {
    path: __dirname,
    filename: 'server.bundle.js',
    publicPath: '/'
  },
  devtool: 'source-map',
  node: { __dirname: false }
}];
