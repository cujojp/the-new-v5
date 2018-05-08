import jsonImporter from 'node-sass-json-importer';

module.exports = options => {
  return {
    entry: './index.js',
    output: {
      filename: 'bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass']
        }
      ],      
      rules: [
        {
          test: /\.scss$/,
          use: [{
            loader: "style-loader"
          }, {
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
      ],
    },
  }
}

