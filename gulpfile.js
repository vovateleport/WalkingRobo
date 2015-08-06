var gulp = require("gulp");
var gutil = require("gulp-util");
var format = require("string-format");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");

//var config = require("./config");
var configDevServer = {//config.get("webpack-dev-server");
	host:'localhost',
	port:9000
};

gulp.task("dev", function(cb) {
	var cfg = Object.create(webpackConfig);
	//override developer config
	cfg.devtool = "eval";
	cfg.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(cfg), {
		stats: {
			colors: true
		}
	}).listen(configDevServer.port, configDevServer.host, function(err) {
			if(err) throw new gutil.PluginError("webpack-dev-server", err);
			gutil.log(format("[webpack-dev-server]", format('http://{0}:{1}/index.html',configDevServer.host,configDevServer.port)));
		});
});