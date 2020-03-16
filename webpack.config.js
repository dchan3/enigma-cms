const path = require('path'), nodeExternals = require('webpack-node-externals'),
  MinifyPlugin = require('babel-minify-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin'), WrapperPlugin = require('wrapper-webpack-plugin'),
  kwTable = require('./babel/common-strings/kw-table.js');

let optimization = {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
          mangle: {
            toplevel: true,
            reserved: Object.values(kwTable)
          },
          keep_fnames: false
        },
        test: /\.jsx?$/i
      })]
  }, resolve = {
    alias: {
      'history': path.resolve(__dirname, 'node_modules', 'history', 'cjs',
        'history.min.js')
    }
  }, filename = '[name].bundle.js',
  pubPath = path.resolve( __dirname, 'public' ),
  mode = process.env.DEV_MODE ? 'development' : 'production', test = /\.jsx?$/i,
  loader = 'babel-loader', comments = false, exclude = /node_modules/, babelrc = true,
  presets = [
    ['@babel/preset-env', { 'modules': 'cjs' }],
    '@babel/preset-react'], topPlugins = [
    new MinifyPlugin({}, {
      comments
    }), new WrapperPlugin({
      header: 'const ' + Object.keys(kwTable).map(k => kwTable[k] + '="' + k + '"').join(',') + ';'
    })
  ]
module.exports = [{
  plugins: topPlugins,
  optimization,
  mode,
  entry: {
    app: './src/client/app/index.js',
    dashboard: './src/client/dashboard/index.js'
  },
  target: 'web',
  module: {
    rules: [
      {
        test,
        exclude,
        loader,
        options: {
          babelrc,
          comments,
          presets,
          plugins: process.env.DEV_MODE ? [] :
            ['@babel/plugin-transform-react-jsx', './babel/rightify', './babel/hashify', './babel/unconcatify', './babel/common-strings']
        }
      },
      {
        test,
        include: /src\/client\/reusables/,
        loader,
        options: {
          babelrc,
          comments,
          presets,
          plugins: ['@babel/plugin-transform-react-jsx', './babel/rightify', './babel/hashify',  './babel/unconcatify', './babel/common-strings',
            ['./babel/from-css-ify', {
              'toFile': path.resolve(__dirname, 'public/app.style.css') }]
          ]
        }
      },
      {
        test,
        include: /react/,
        loader,
        options: {
          comments,
          plugins: process.env.DEV_MODE ? [] :
            ['./babel/rightify']
        }
      },
      {
        test,
        include: /buffer/,
        loader: 'babel-loader',
        options: {
          comments,
          plugins: process.env.DEV_MODE ? [] :
            ['./babel/rightify', './babel/hashify', './babel/common-strings']
        }
      },
    ]
  },
  output: {
    path: pubPath,
    publicPath: pubPath,
    filename
  },
  resolve,
}, {
  optimization,
  mode,
  plugins: topPlugins,
  entry: {
    server: './src/server/server.js'
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test,
        exclude,
        loader,
        options: {
          babelrc,
          comments,
          presets,
          plugins: process.env.DEV_MODE ? [] :
            ['@babel/plugin-transform-react-jsx', './babel/rightify', './babel/hashify', './babel/unconcatify', './babel/common-strings']

        }
      },
      {
        test,
        include: /src\/client\/reusables/,
        loader,
        options: {
          babelrc,
          comments,
          presets,
          plugins: [ '@babel/plugin-transform-react-jsx', './babel/rightify', './babel/hashify',  './babel/unconcatify', './babel/from-css-ify' ]
        }
      },
      {
        test,
        include: /src\/server\/routes\/ssr/,
        loader,
        options: {
          babelrc,
          comments,
          presets,
          plugins: ['@babel/plugin-transform-react-jsx', './babel/rightify', './babel/hashify', './babel/unconcatify', './babel/autominify', './babel/common-strings']
        }
      },
    ],
  },
  output: {
    path: __dirname,
    filename,
    publicPath: '/'
  },
  resolve,
  node: { __dirname: false }
}];
