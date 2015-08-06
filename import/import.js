"use strict";

var sh = require('shelljs');
sh.config.fatal = true;
var hjson = require('hjson');
var fs = require('fs');
var path = require('path');

var args = process.argv.slice(2);
var configPath = args.length>0?args[0]:'test.hjson';

//var fileConfig=fs.readFileSync(path.resolve(__dirname,configPath),{encoding:'utf8'});
//var c = hjson.parse(fileConfig);
var c = require("./testc");

var baseDir = c.baseDir||__dirname;
console.log('baseDir:', baseDir);

var styleFileFullPath = path.resolve(baseDir, c.stylesFile);

var t = c.tasks[0];
console.log('task0:', JSON.stringify(t,null,2));

var cmd = {};
cmd.download = `wget -O ${t.name}_src.osm.pbf ${t.file}`;
cmd.osmosis = `osmosis -v --read-pbf ./${t.name}_src.osm.pbf --bounding-box top=${t.bbox.top} left=${t.bbox.left} bottom=${t.bbox.bottom} right=${t.bbox.rigth} completeWays=yes --lp --write-pbf ${t.name}.osm.pbf`;
cmd.to_sql = `osm2pgsql -d ${t.name} ${t.name}.osm.pbf -P 5432 -U robosm --cache-strategy sparse -C 500 --style ${styleFileFullPath}`;

console.log('pwd:',sh.pwd());
sh.cd(sh.pwd());
sh.cd('..');
var pwd1 = sh.pwd();
console.log('pwd2:',sh.pwd());
console.log('_tt', JSON.stringify([pwd1,baseDir,pwd1==baseDir,pwd1===baseDir]));
sh.cd(baseDir);
sh.mkdir('-p','build');
sh.cd('build');
sh.mkdir('-p', t.name);
sh.cd(t.name);

Promise.all([
	execPromise(cmd.download),
	execPromise(cmd.osmosis),
	execPromise(cmd.to_sql)
]).then(function(data){
	console.log('success!');
}).catch(function(err){
	console.log('fail.');
});

function execPromise(command){
	return new Promise(function(ok,fail){
		sh.exec(command, function(code, output) {
			console.log('Exit code:', code);
			console.log('Program output:', output);
		});
		ok();
	});
}
