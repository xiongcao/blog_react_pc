const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
  // optimization: {
  //   usedExports: true
  // },
  output: {
    pathinfo: false
  },
  devtool: 'inline-source-map', // 开发环境下使用，将编译后的代码映射回原始源代码
  devServer: {  // 将 dist 目录下的文件 serve 到 localhost:8080 下
    contentBase: '../dist',
    hot: true,
    port: 81,
    proxy: {
      '/api': 'http://localhost:8080' // 请求到 /api/users 现在会被代理到请求 http://localhost:8080/api/users
    },
    https: true,
    // host: '0.0.0.0',
    open: true, // 启动后打开浏览器
    compress: true // 一切服务都启用 gzip 压缩
  },
  module: {
    rules: [
      // import css
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  }
});