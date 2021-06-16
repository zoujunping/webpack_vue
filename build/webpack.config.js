const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //引入插件
// const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
    mode:'development', // 开发模式
    entry: path.resolve(__dirname,'../src/main.js'),    // 入口文件(未改前)
	// entry: { //多入口文件配置(改完后)
	//       main:path.resolve(__dirname,'../src/main.js'),
	//       header:path.resolve(__dirname,'../src/header.js')
	//   }, 
    output: { //打包出口
        // filename: 'output.js',      // 打包后的文件名称(未改前)
        filename: '[name].[hash:8].js',      // 打包后的文件名称(配置后)
        path: path.resolve(__dirname,'../dist')  // 打包后的目录
    },
	 plugins:[ //插件存放位置
	      new HtmlWebpackPlugin({
	        template:path.resolve(__dirname,'../public/index.html'),
			filename:'index.html',
			chunks:['main'] //与入口文件对应的模块名
	      }),
		 //多入口文件配置(html-webpack-plugin实例来解决这个问题)
		  // new HtmlWebpackPlugin({
		  //         template:path.resolve(__dirname,'../public/header.html'),
		  //         filename:'header.html',
		  //         chunks:['header'] // 与入口文件对应的模块名
		  //       }),
			// new CleanWebpackPlugin()
	    ]
}
