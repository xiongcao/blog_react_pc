const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 重新生成dist内文件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 将 bundle 内容展示为便捷的、交互式、可缩放的树状图形式。

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: 'js/[name]-[hash].js',
    path: path.resolve(__dirname, '../dist'),
    // publicPath: '/' // 与server.js 对应
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 模块热替换
    new HtmlWebpackPlugin(),
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      // import css
      // import css
      // test: /\.css$/,
      // use: [
      //   'style-loader',
      //   'css-loader'
      // ]
      // 加载图片,使之在css中url('.png')
      {
        test: /\.(le|sa)ss$/,
        use: [{
          loader: 'less-loader'
        }, {
          loader: 'sass-loader'
        }]
        // use: [{
        //   loader: 'style-loader'
        // }, {
        //   loader: 'css-loader', options: {
        //     sourceMap: true
        //   }
        // }, {
        //   loader: 'less-loader', options: {
        //     sourceMap: true
        //   }
        // }]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 1024 * 100, // 200kb 单位字节byte
            name: '[name]-[hash:7].[ext]',
            outputPath: "img"
          }
        }]
      },
      // 加载fonts字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 1024 * 100, // 100kb 单位字节byte
            name: '[name].[hash:7].[ext]',
            outputPath: "fonts"
          }
        }]
      },
      // 允许import csv tsv xml 文件
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      }
    ]
  }
};