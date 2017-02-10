var webpack = require('webpack');
var path = require('path');

// var path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

var HtmlWebpackPlugin  = require('html-webpack-plugin');

// Webpack Config

var webpackConfig = {
  entry: {
    'polyfills': './src/polyfills.browser.ts',
    'vendor':    './src/vendor.browser.ts',
    'main':       './src/main.browser.ts'
  },

  output: {
    path: './dist',
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({ name: ['main', 'vendor', 'polyfills'], minChunks: Infinity }),
    new HtmlWebpackPlugin({
        template: path.resolve("./src", 'index.html'),
        favicon: path.resolve("./src", 'favicon.ico'),
        inject: false
    })
  ],

  module: {
    loaders: [
      // .ts files for TypeScript
      { test: /\.ts$/, loaders: ['awesome-typescript-loader', 'angular2-template-loader'] },
      { test: /\.css$/, loaders: ['to-string-loader', 'css-loader'] },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader']},
      { test: /initial\.scss$/, loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader!sass-loader?sourceMap'
        })
      },
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.(jpg|png|gif)$/, loader: 'file-loader'},
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=fonts/[name].[ext]" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=fonts/[name].[ext]" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=fonts/[name].[ext]" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=fonts/[name].[ext]" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=fonts/[name].[ext]" }
    ]
  }

};


// Our Webpack Defaults
var defaultConfig = {
  devtool: 'cheap-module-source-map',
  cache: true,
  debug: true,
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    root: [ path.join(__dirname, 'src') ],
    extensions: ['', '.ts', '.js', '.scss', '.json']
  },

  devServer: {
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 }
  },

  node: {
    global: 1,
    crypto: 'empty',
    module: 0,
    Buffer: 0,
    clearImmediate: 0,
    setImmediate: 0
  }
};

var webpackMerge = require('webpack-merge');
module.exports = webpackMerge(defaultConfig, webpackConfig);