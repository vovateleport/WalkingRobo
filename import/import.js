"use strict";

var sh = require('shelljs');
sh.config.fatal = true;
var hjson = require('hjson');
var fs = require('fs');
var path = require('path');

var args = process.argv.slice(2);
var configPath = args.length>0?args[0]:'test.hjson';

var c = require("./testc");
var baseDir = c.baseDir||__dirname;
var styleFileFullPath = path.resolve(baseDir, c.stylesFile);

var t = c.tasks[0];

var cmd = {};
cmd.download = `wget -O ${t.name}_src.osm.pbf ${t.file} > output.log`;
cmd.osmosis = `osmosis -v --read-pbf ./${t.name}_src.osm.pbf --bounding-box top=${t.bbox.top} left=${t.bbox.left} bottom=${t.bbox.bottom} right=${t.bbox.rigth} completeWays=yes --lp --write-pbf ${t.name}.osm.pbf >> output.log`;
cmd.to_sql = `osm2pgsql -d ${t.name} ${t.name}.osm.pbf -P 5432 -U robosm --cache-strategy sparse -C 500 --style ${styleFileFullPath} >> output.log`;

sh.cd(baseDir);
sh.mkdir('-p',`build`);
sh.cd('build');
sh.mkdir('-p', t.name);
sh.cd(t.name);

runGenerator(function*(){
	yield execPromise(cmd.download);
	yield execPromise(cmd.osmosis);
	yield execPromise(cmd.to_sql);
});


function execPromise(command){
	return new Promise(function(ok,fail){
		sh.exec(command, function(code, output) {
			console.log('Exit code:', code);
			console.log('Program output:', output);
			ok();
		});
	});
}

function runGenerator(g) {
	var it = g(), ret;
	// asynchronously iterate over generator
	(function iterate(val){
		ret = it.next( val );

		if (!ret.done) {
			// poor man's "is it a promise?" test
			if ("then" in ret.value) {
				// wait on the promise
				ret.value.then( iterate );
			}
			// immediate value: just send right back in
			else {
				// avoid synchronous recursion
				setTimeout( function(){
					iterate( ret.value );
				}, 0 );
			}
		}
	})();
}
