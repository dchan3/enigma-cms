const path = require('path'), nodeExternals = require('webpack-node-externals'),
  TerserPlugin = require('terser-webpack-plugin'),
  { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = [{
  plugins: process.env.ANALYZER ? [
    new BundleAnalyzerPlugin({ analyzerPort: 9001 }),
  ] : [],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
          mangle: {
            toplevel: true
          },
          keep_fnames: false
        },
        test: /\.jsx?$/i
      })]
  },
  mode: process.env.DEV_MODE ? 'development' : 'production',
  entry: {
    app: './src/client/app/index.js',
    dashboard: './src/client/dashboard/index.js'
  },
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
          plugins: process.env.DEV_MODE ? ['./babel/unitify-react'] :
            ['./babel/rightify', './babel/hashify', './babel/unitify-react', './babel/unconcatify']
        }
      },
      {
        test: /\.jsx?$/i,
        include: /src\/client\/reusables/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          comments: false,
          plugins: ['./babel/rightify', './babel/hashify',
            ['./babel/from-css-ify', {
              'toFile': path.resolve(__dirname, 'public/app.style.css') }],
            '@babel/plugin-transform-react-jsx', './babel/unitify-react',
          ]
        }
      },
      {
        test: /\.jsx?$/,
        include: /react/,
        loader: 'babel-loader',
        options: {
          comments: false,
          plugins: process.env.DEV_MODE ? [] :
            ['./babel/rightify']
        }
      },
      {
        test: /\.jsx?$/,
        include: /buffer/,
        loader: 'babel-loader',
        options: {
          comments: false,
          plugins: process.env.DEV_MODE ? [] :
            ['./babel/rightify', './babel/hashify']
        }
      },
    ]
  },
  output: {
    path: path.resolve( __dirname, 'public' ),
    publicPath: path.resolve( __dirname, 'public' ),
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      'history': path.resolve(__dirname, 'node_modules', 'history', 'cjs',
        'history.min.js')
    }
  },
  devtool: 'source-map'
}, {
  plugins: process.env.ANALYZER ? [
    new BundleAnalyzerPlugin({ analyzerPort: 9002 })
  ] : [],
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        output: {
          comments: false,
        },
        mangle: {
          toplevel: true
        },
        keep_fnames: true
      },
      test: /\.jsx?$/i,
    })]
  },
  mode: process.env.DEV_MODE ? 'development' : 'production',
  entry: {
    server: './src/server/server.js'
  },
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
          comments: false
        }
      },
      {
        test: /\.jsx?$/i,
        include: /src\/client\/reusables/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          comments: false,
          plugins: ['./babel/rightify', './babel/hashify', './babel/from-css-ify', '@babel/plugin-transform-react-jsx',
            './babel/unitify-react', ]
        }
      },
      {
        test: /\.jsx?$/,
        include: /src\/server\/routes\/ssr/,
        loader: 'babel-loader',
        options: {
          comments: false,
          plugins: ['./babel/unconcatify', './babel/autominify']
        }
      },
    ],
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'react-dom/server': path.resolve(__dirname, 'node_modules', 'react-dom',
        'cjs', 'react-dom-server.node.production.min.js'),
      'history': path.resolve(__dirname, 'node_modules', 'history', 'cjs',
        'history.min.js')
    }
  },
  devtool: 'source-map',
  node: { __dirname: false }
}];
