const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.babel.js');

module.exports = merge(common, {
  watch: false,
  plugins: [
    new UglifyJSPlugin()
  ]
});
