const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'app/src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app/build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '/app/public/index.html'
    })
  ],
}