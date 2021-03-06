import jsonImporter from 'node-sass-json-importer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackPugPlugin from 'html-webpack-pug-plugin';
import path from 'path';
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = options => {
  return {
    entry: './src/js/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        { 
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
          loader: "url-loader?limit=10000&minetype=application/font-woff" 
        },
        { 
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
          exclude: [resolve('src/svg')],
          loader: "file-loader" 
        },
        {
          test: /\.pug$/,
          use: 'pug-loader'
        },
        {
          test: /\.scss$/,
          use: [
          MiniCssExtractPlugin.loader,  
          {
            loader: "css-loader", 
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          }, {
            loader: "sass-loader", 
            options: {
              sourceMap: true,
              importer: jsonImporter
            }
          }]
        },
        {
          test: /.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/html/index.pug'),
      }),
      new SpriteLoaderPlugin({
        plainSprite: true,
      })
    ],
    devtool: "source-map"
  }
}

