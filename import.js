var sh = require('shelljs');
sh.config.fatal = true;
var hjson = require('hjson');
var fs = require('fs');
var path = require('path');

var args = process.argv.slice(2);
var configPath = args.length>0?args[0]:'test.hjson';

var fileConfig=fs.readFileSync(path.resolve(__dirname,configPath),{encoding:'utf8'});
var c = hjson.parse(fileConfig);

var baseDir = c.baseDir||__dirname;
console.log('baseDir:', baseDir);

var styleFileFullPath = path.resolve(baseDir, c.stylesFile);

var t = c.tasks[0];
console.log('task0:', JSON.stringify(t,null,2));

var cmd = {};
cmd.download = `wget -O ${t.name}_src.osm.pbf ${t.file}`;
cmd.osmosis = `osmosis -v --read-pbf ./${t.name}_src.osm.pbf --bounding-box top=${t.bbox.top} left=${t.bbox.left} bottom=${t.bbox.bottom} right=${t.bbox.rigth} completeWays=yes --lp --write-pbf ${t.name}.osm.pbf`;
cmd.to_sql = `osm2pgsql -U gis --database ${t.name} -W ${t.name}.osm.pbf -P 5432 -H localhost --cache-strategy sparse -C 500 --style ${styleFileFullPath}`;

sh.pwd();
sh.cd(baseDir);
sh.makedir('-p','build');
sh.cd('build');
sh.makedir('-p', t.name);
sh.cd(t.name);
sh.exec(cmd.download);
sh.exec(cmd.osmosis);
sh.exec(cmd.to_sql);

