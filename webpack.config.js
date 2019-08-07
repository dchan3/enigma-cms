const path = require('path'), nodeExternals = require('webpack-node-externals'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
  { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const cssPlugin = new MiniCssExtractPlugin({
    filename: 'app.style.css'
  }), loRep = new LodashModuleReplacementPlugin();

module.exports = [{
  plugins: process.env.ANALYZER ? [
    new BundleAnalyzerPlugin(),
    cssPlugin, loRep
  ] : [cssPlugin, loRep],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
        test: /\.jsx?$/i
      })]
  },
  mode: process.env.DEV_MODE ? 'development' : 'production',
  entry:  './src/client/app/index.js',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: true,
          comments: false,
          plugins: ['./babel/hashify']
        }
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          }
        ]
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
        path.resolve(__dirname, 'node_modules', 'styled-components', 'dist',
          'styled-components.cjs.js'),
      'react-dom/server': path.resolve(__dirname, 'node_modules', 'react-dom',
        'cjs', 'react-dom-server.browser.production.min.js'),
      'react-router-dom': path.resolve(__dirname, 'node_modules',
        'react-router-dom'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom', 'cjs',
        'react-dom.production.min.js'),
      'react': path.resolve(__dirname, 'node_modules', 'react', 'cjs',
        'react.production.min.js'),
      'prop-types': path.resolve(__dirname, 'node_modules', 'prop-types',
        'prop-types.min.js'),
      'history': path.resolve(__dirname, 'node_modules', 'history', 'cjs',
        'history.min.js')
    }
  },
  devtool: 'source-map'
}, {
  plugins: process.env.ANALYZER ? [
    new BundleAnalyzerPlugin()
  ] : [],
  optimization: {
    minimizer: [new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false,
        },
      },
      test: /\.jsx?$/i,
    })],
    splitChunks: {
      chunks: 'all'
    }
  },
  mode: process.env.DEV_MODE ? 'development' : 'production',
  entry: './src/server/server.js',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: true,
          comments: false,
          plugins: ['./babel/hashify']
        }
      },
      {
        test: /\.jsx?$/i,
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
  resolve: {
    alias: {
      'react-dom/server': path.resolve(__dirname, 'node_modules', 'react-dom',
        'cjs', 'react-dom-server.node.production.min.js'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom',
        'cjs', 'react-dom.production.min.js'),
      'react-router-dom': path.resolve(__dirname, 'node_modules',
        'react-router-dom'),
      'prop-types': path.resolve(__dirname, 'node_modules', 'prop-types',
        'prop-types.min.js'),
      'history': path.resolve(__dirname, 'node_modules', 'history', 'cjs',
        'history.min.js')
    }
  },
  devtool: 'source-map',
  node: { __dirname: false }
}];
