const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 重新生成dist内文件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 将 bundle 内容展示为便捷的、交互式、可缩放的树状图形式。
// const devMode = process.env.NODE_ENV !== 'production';

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // entry: [
  //   {
  //     app: '../src/index.js'
  //   }
  //   // path.resolve(__dirname, 'index.js'),
  //   // 'react-hot-loader/patch', // 这里reload=true的意思是，如果碰到不能hot reload的情况，就整页刷新。
  //   // 'webpack-hot-middleware/client?reload=true'
  // ],
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
    new HtmlWebpackPlugin(
      {
        filename: 'index.html',
        template: 'index.html', // 模板路径
        favicon: 'favicon.ico',
        inject: 'body' // js插入位置
      }
    ),
    // new BundleAnalyzerPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.less', '.scss', '.json'],
    alias: {
      '@': resolve('src'),
      '@assets':resolve('src/assets'),
      '@img':resolve('src/assets/img'),
      '@styles':resolve('src/assets/styles'),
      '@components':resolve('src/components'),
      '@libs':resolve('src/libs'),
      '@layouts':resolve('src/layouts'),
      '@utils':resolve('src/utils')
    }
  },
  module: {
    rules: [
      {
        test: /\.(m?js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['@babel/preset-env', '@babel/preset-react'],
            // plugins: ['@babel/plugin-proposal-object-rest-spread', 'react-hot-loader/babel']
          }
        },
        include:/src/
      },
      // 加载图片,使之在css中url('.png')
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