const webpack  = require('webpack')
const progress = require('progress-bar-webpack-plugin')
const path     = require('path')
const args     = require('yargs').argv

const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: args.minify ? 'production' : 'development',
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    filename: 'index.js'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  // configuration for eslint runtime
  // eslint: eslintConfiguration,
  module: {
    rules: [
      //Preloaders, defined with `enforce: 'pre'`
      // { test: /\.(js|vue|jsx)$/, loader: 'eslint-loader', exclude: /node_modules/, enforce: 'pre' },

      { test: /\.vue$/,  loader: 'vue-loader' },
      { test: /\.css$/,  loader: 'style-loader!css-loader' },
      { test: /\.(styl|stylus)$/, loader: 'style-loader!css-loader!stylus-loader' },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new progress()
  ]
}