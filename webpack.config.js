var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');

var buildWeb = 'build/web';
module.exports = {
	entry: './web/app-entry',
	context: __dirname,
	output: {
		path: path.join(__dirname, buildWeb),
		filename: 'bundle.[hash].js'
	},
	module: {
		loaders: [
			{
				test: /\.es6$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					optional: ['runtime'],
					stage: 1
				}
			},
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
			{ test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")},
			{ test: /\.(png|gif|woff|woff2|eot|ttf|svg)(\?v=4.3.0)?$/, loader: 'url-loader?limit=10000&name=[path][name].[ext]?[hash]' }
		]
	},
	devtool:'source-map',
	cache : true,
	resolve:{
		root: [
			__dirname,
			path.join(__dirname, "bower_components")
		],
		extensions: ['', '.js', '.es6']
	},
	plugins: [
		new Clean([buildWeb]),
		new ExtractTextPlugin("app.[hash].css", {allChunks:true}),
		new webpack.ResolverPlugin(
			new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
		),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'web/index.html'
		})
	]
};