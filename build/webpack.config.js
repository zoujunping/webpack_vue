const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //引入插件
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); //清除打包留下的文件插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //拆分css样式插件
const vueLoaderPlugin = require('vue-loader/lib/plugin') //vue-loader 用于解析.vue文件
const Webpack = require('webpack') //配置webpack-dev-server进行热更新
const devMode = process.argv.indexOf('--mode=production') === -1;
// 优化构建webpack
const TerserPlugin = require('terser-webpack-plugin'); //增强代码压缩 ，并行处理多个子任务，效率会更加的提高
module.exports = {
    mode:'development', // 开发模式
    entry: path.resolve(__dirname,'../src/main.js'),    // 入口文件(未改前)
	// entry: ["@babel/polyfill",path.resolve(__dirname,'../src/index.js')],    // 入口文件
	// entry: { //多入口文件配置(改完后)
	//       main:path.resolve(__dirname,'../src/main.js'),
	//       header:path.resolve(__dirname,'../src/header.js')
	//   }, 
    output: { //打包出口
        // filename: 'output.js',      // 打包后的文件名称(未改前)
        filename:'js/[name].[hash:8].js',
        chunkFilename:'js/[name].[hash:8].js',      // 打包后的文件名称(配置后)
        path: path.resolve(__dirname,'../dist')  // 打包后的目录
    },
	
	module:{ //样式模块
	      rules:[
	        {
	          test:/\.css$/,
	          use:[{
          loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          options:{
            publicPath:"../dist/css/",
            hmr:devMode
          }
        },'css-loader',{
            loader:'postcss-loader',
          }] // 从右向左解析原则
	        },
	        {
	          test:/\.less$/,
	          use:[{
          loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          options:{
            publicPath:"../dist/css/",
            hmr:devMode
          }
        },'css-loader',{
                loader:'postcss-loader',
            },'less-loader'] // 从右向左解析原则
	        },
			//用babel转义js文件，为了使我们的js代码兼容更多的环境我们需要安装依赖
			{
			    test:/\.vue$/,
			    use:['vue-loader']
			},
			{
			  test:/\.js$/,
			  use:{
			    loader:'babel-loader',
			    options:{
			      presets:['@babel/preset-env']
			    }
			  },
			  exclude:/node_modules/
			},
			//打包 图片、字体、媒体、等文件模块
			{
			  test: /\.(jpe?g|png|gif)$/i, //图片文件
			  use: [
			    {
			      loader: 'url-loader',
			      options: {
			        limit: 10240,
			        fallback: {
			          loader: 'file-loader',
			          options: {
			              name: 'img/[name].[hash:8].[ext]'
			          }
			        }
			      }
			    }
			  ]
			},
			{
			  test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
			  use: [
			    {
			      loader: 'url-loader',
			      options: {
			        limit: 10240,
			        fallback: {
			          loader: 'file-loader',
			          options: {
			            name: 'media/[name].[hash:8].[ext]'
			          }
			        }
			      }
			    }
			  ]
			},
			{
			  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
			  use: [
			    {
			      loader: 'url-loader',
			      options: {
			        limit: 10240,
			        fallback: {
			          loader: 'file-loader',
			          options: {
			            name: 'fonts/[name].[hash:8].[ext]'
			          }
			        }
			      }
			    }
			  ]
			}
	      ]
	    },
		 //用于解析.vue文件
	    resolve:{
	        alias:{
	          'vue$':'vue/dist/vue.runtime.esm.js',
	          ' @':path.resolve(__dirname,'../src')
	        },
	        extensions:['*','.js','.json','.vue']
	   },
	   plugins:[ //插件存放位置
	        new HtmlWebpackPlugin({
	          template:path.resolve(__dirname,'../public/index.html'),
	   			filename:'index.html',
	   			chunks:['main'] //与入口文件对应的模块名
	        }),
	   		new MiniCssExtractPlugin({ //拆分css样式插件
	   		      filename: devMode ? '[name].css' : '[name].[hash].css',
	   		      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
	   		  }),
	   		 //多入口文件配置(html-webpack-plugin实例来解决这个问题)
	   		  // new HtmlWebpackPlugin({
	   		  //         template:path.resolve(__dirname,'../public/header.html'),
	   		  //         filename:'header.html',
	   		  //         chunks:['header'] // 与入口文件对应的模块名
	   		  //       }),
	   		new CleanWebpackPlugin(),
	   		// new Webpack.HotModuleReplacementPlugin(),
	   		new vueLoaderPlugin(),
	   		
	      ],
		optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							ecma: 5,
							warnings: false,
							parse: {},
							compress: {},
							mangle: true, // Note `mangle.properties` is `false` by default.
							module: false,
							output: null,
							toplevel: false,
							nameCache: null,
							ie8: false,
							keep_fnames: false,
							safari10: true
						}
					})
				]
		}
		
	}
	  
