"use strict";

var sh = require('shelljs');
sh.config.fatal = true;
var hjson = require('hjson');
var fs = require('fs');
var path = require('path');
var c = require("./testc");

var _result = {start:Date.now(), log:[]};
var _cmd = {};
var _resultFile = '';

runGenerator(function*(){
	yield new Promise(function(ok){
		prepare();
		console.log('Prepare OK');
		ok();
	});
	yield execPromise(_cmd.download);
	yield execPromise(_cmd.osmosis);
	yield execPromise(_cmd.to_sql);
	yield new Promise(function(ok){
		writeResult();
		ok();
	});

});

function writeResult(err){
	console.log('Finishing');

	_result.finish = Date.now();
	_result.duration = _result.finish - _result.start;
	_result.result =  !err ? 'success':'fail';
	if (err)
		_result.error = JSON.stringify(err);

	try {
		fs.writeFileSync(_resultFile, JSON.stringify(_result), {encoding: 'utf8'});
	}
	catch(err0){
		console.log('error',JSON.stringify(err0));
	}
	console.log('Finished! Result in ',_resultFile);
}

function prepare() {
	var args = process.argv.slice(2);
	var configPath = args.length > 0 ? args[0] : 'test.hjson';

	var baseDir = c.baseDir || __dirname;
	var styleFileFullPath = path.resolve(baseDir, c.stylesFile);

	var t = c.tasks[0];
	_resultFile = path.resolve(baseDir,'build',t.name,'import.result');

	_cmd.download = `wget -O ${t.name}_src.osm.pbf ${t.file}`;
	_cmd.osmosis = `osmosis -v --read-pbf ./${t.name}_src.osm.pbf --bounding-box top=${t.bbox.top} left=${t.bbox.left} bottom=${t.bbox.bottom} right=${t.bbox.rigth} completeWays=yes --lp --write-pbf ${t.name}.osm.pbf`;
	_cmd.to_sql = `osm2pgsql -d ${t.name} ${t.name}.osm.pbf -P 5432 -U robosm --cache-strategy sparse -C 500 --style ${styleFileFullPath}`;

	sh.cd(baseDir);
	sh.mkdir('-p', `build`);
	sh.cd('build');
	sh.mkdir('-p', t.name);
	sh.cd(t.name);

	console.log('Commands:',JSON.stringify(_cmd,null,2));
}

function execPromise(command){
	return new Promise(function(ok,fail){
		sh.exec(command, function(code, output) {
			_result.log.push( {command: command, exitCode:code, output:output});
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
				ret.value
					.then(iterate)
					.catch(function(err){
						writeResult(err);
						throw err;
					});
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
