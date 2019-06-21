dev: 热更新,速度非常快, 作用的是webpack.config.js 中的devServer
start: 热更新，作用的是dev-server.js(Node.js API)
srver: 不会热更新
build: 打包
watch: 打包并监听dist文件改动，需手动刷新浏览器
analyz: 可视化展示依赖关系
http-server： 使用的是node http-server 搭建的服务器，可访问dist