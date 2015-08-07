var _ = require('lodash');
var sh = require('shelljs'); sh.config.fatal = true;
var fs = require('fs');
var path = require('path');
var c = require('./testc');
var merger = require('./merge-styles');
var minimist = require('minimist');

var _wr = null;//context

runGenerator(main);

function*main(){
	var args = minimist(process.argv.slice(2));
	//console.dir(args);

	var taskName = args.task|| null;
	var step = args.step||null;

	if (!taskName) {
		for(var i=0;i<c.tasks.length;i++){
			yield* _task(c.tasks[i].name,step);
		}
	}
	else {
		yield* _task(taskName,step);
	}
}

function* _task(taskName, step){
	var tf = _.find(c.tasks, function(t){
			return t.name==taskName;
		});
	if (tf==null) {
		console.log(`No task '${taskName}'`);
		sh.exit(1);
	}

	yield new Promise(function(ok,fail){
		try {
			prepare(tf);
		}
		catch(err){
			return fail(err);
		}
		console.log(`Task '${tf.name}' prepared.`);
		ok();
	});
	if (step && _wr.cmd.step) {
		yield execPromise(_wr.cmd[step]);
	}
	else {
		yield execPromise(_wr.cmd.download);
		yield execPromise(_wr.cmd.osmosis);
		yield execPromise(_wr.cmd.sql);
	}

	yield new Promise(function(ok){
		writeResult();
		ok();
	});
}

function prepare(task) {
	console.log('Task', JSON.stringify(task));
	_wr = {};
	_wr.task = task;
	_wr.result = {result:null, start: new Date(), finish:null, durationMs:null,error:null, log:[]};
	_wr.cmd = {};
	_wr.pathOutput = path.resolve(c.baseDir,'build',task.name);
	_wr.resultLog = path.resolve(_wr.pathOutput,'import-result.txt');
	_wr.resultStyles = path.resolve(_wr.pathOutput,'load-styles.txt');

	_wr.cmd.download = `wget -O ${task.name}_src.osm.pbf ${task.file}`;
	_wr.cmd.osmosis = `osmosis -v --read-pbf ./${task.name}_src.osm.pbf --bounding-box top=${task.bbox.top} left=${task.bbox.left} bottom=${task.bbox.bottom} right=${task.bbox.rigth} completeWays=yes --lp --write-pbf ${task.name}.osm.pbf`;
	_wr.cmd.sql = `osm2pgsql -d ${task.name} ${task.name}.osm.pbf -U robosm --cache-strategy sparse -C 500 --style ${_wr.resultStyles}`;

	sh.cd(c.baseDir);
	sh.mkdir('-p', _wr.pathOutput);
	sh.cd(_wr.pathOutput);

	merger.merge(_wr.resultStyles);
}

function writeResult(err){
	_wr.result.finish = new Date();
	_wr.result.durationMs = _wr.result.finish - _wr.result.start;
	_wr.result.result =  !err ? 'success':'fail';
	if (err)
		_wr.result.error = JSON.stringify(err);

	try {
		fs.writeFileSync(_wr.resultLog, JSON.stringify(_wr.result,null,2), {encoding: 'utf8'});
	}
	catch(err0){
		console.log('error',JSON.stringify(err0));
	}
	console.log(`Task '${_wr.task.name}' finished. See details in ${_wr.resultLog}`);
	_wr = null;
}

function execPromise(command){
	return new Promise(function(ok,fail){
		sh.exec(command, function(code, output) {
			_wr.result.log.push( {command: command, exitCode:code, output:output.split(/\r\n|\r|\n/g)});
			if (code!=0)
				fail(output);
			else
				ok();
		});
	});
}

function runGenerator(g) {
	var it = g(), ret;
	(function iterate(val){
		ret = it.next( val );

		if (!ret.done) {
			if ("then" in ret.value) {
				ret.value
					.then(iterate)
					.catch(function(err){
						console.log('runGenerator_err',err);
						writeResult(err);
						throw err;
					});
			}
			else {
				setTimeout( function(){
					iterate( ret.value );
				}, 0 );
			}
		}
	})();
}
