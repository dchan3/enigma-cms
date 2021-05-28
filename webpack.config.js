const path = require('path'), nodeExternals = require('webpack-node-externals'),
  TerserPlugin = require('terser-webpack-plugin'), WrapperPlugin = require('wrapper-webpack-plugin'),
  kwTable = require('./babel/common-strings/kw-table.js'), commonStringsCfg = require('./commonStringsConfig.js');

let optimization = {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
          sourceMap: true,
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
        'history.min.js'),
      'preact': path.resolve(__dirname, 'node_modules', 'preact', 'dist',
        'preact.min.js')
    }
  }, filename = '[name].bundle.js',
  pubPath = path.resolve( __dirname, 'public' ),
  mode = process.env.DEV_MODE ? 'development' : 'production', test = /\.jsx?$/i,
  loader = 'babel-loader', comments = false, exclude = /node_modules/, babelrc = true,
  presets = [
    ['@babel/preset-env', { 'modules': 'cjs' }],
    '@babel/preset-react'], topPlugins = [
      new WrapperPlugin({
        header: 'const ' + Object.keys(kwTable).map(
          (k) => {
            if (k === 'true' || k === 'false' || k === 'null' || k === 'UNDEFINED') {
              return kwTable[k] + '=' + k.toLowerCase();
            }
            else return k.match(/^\d+$/) ? (kwTable[k] + '=' + k) : (kwTable[k] + '="' + k + '"');
          }).join(',') + (
              (commonStringsCfg && Object.keys(commonStringsCfg).length > 0) ?
              (',' + Object.keys(commonStringsCfg).map(k => commonStringsCfg[k] + '=' +  "'" + k + "'").join(',')) : "") + ';'
        })
    ];

module.exports = [{
  entry: {
    preact: path.resolve(__dirname, 'node_modules', 'preact', 'dist',
      'preact.min.js'),
    preactHooks: path.resolve(__dirname, 'node_modules', 'preact', 'hooks', 'dist',
      'hooks.js'),
    preactCompat: path.resolve(__dirname, 'node_modules', 'preact', 'compat', 'dist',
      'compat.js')
  },
  target: 'web',
  module: {
    rules: [
      {

      }
    ]
  },
  output: {
    path: pubPath,
    publicPath: pubPath,
    filename,
    libraryTarget: 'var',
    library: '[name]',
  }
}, {
  plugins: topPlugins,
  optimization,
  mode,
  entry: {
    app: './src/client/app/index.js',
    dashboard: './src/client/dashboard/index.js'
  },
  target: 'web',
  externals: {
    "preact": "preact",
    "preact/hooks": "preactHooks",
    "preact/compat": "preactCompat"
  },
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
          plugins: process.env.DEV_MODE ? [['poggerstylez/babel', {
            toFile: path.resolve(__dirname, 'public/app.style.css')
          }]] :
            [["poggerstylez/babel", { toFile: path.resolve(__dirname, 'public/app.style.css') }], '@babel/plugin-transform-react-jsx', './babel/rightify', './babel/unconcatify', ['./babel/common-strings', {
              table: commonStringsCfg
            }]]
        }
      }
    ]
  },
  output: {
    path: pubPath,
    publicPath: pubPath,
    filename
  },
  resolve: {
    alias: {
      'history': path.resolve(__dirname, 'node_modules', 'history', 'cjs',
        'history.min.js'),
      'preact': path.resolve(__dirname, 'node_modules', 'preact', 'dist',
        'preact.min.js') 
    }
  },
  devtool: 'source-map'
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
            ["poggerstylez/babel", '@babel/plugin-transform-react-jsx', './babel/rightify', './babel/unconcatify',
              ['./babel/common-strings', { table: commonStringsCfg }]]
        }
      },
      {
        test,
        exclude,
        loader,
        options: {
          babelrc,
          comments,
          presets,
          plugins: ["poggerstylez/babel", '@babel/plugin-transform-react-jsx', './babel/rightify', './babel/unconcatify', './babel/autominify', ['./babel/common-strings', { table: commonStringsCfg }]]
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
  node: { __dirname: false },
  devtool: 'source-map'
}];
