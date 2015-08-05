var sh = require('shelljs');
var hjson = require('hjson');
var fs = require('fs');
var path = require('path');

var fileConfig=fs.readFileSync(path.resolve(__dirname,'test.hjson'),{encoding:'utf8'});
var c = hjson.parse(fileConfig);

var baseDir = c.baseDir||__dirname;
var styleFile = path.resolve(baseDir, c.styles);

var t = c.tasks[0];

var cmd = {};
cmd.download = `wget -O ${t.name}_src.osm.pbf ${t.file}`;
cmd.osmosis = `osmosis -v --read-pbf ./${t.name}_src.osm.pbf --bounding-box top=${t.bbox.top} left=${t.bbox.left} bottom=${t.bbox.bottom} right=${t.bbox.rigth} completeWays=yes --lp --write-pbf ${t.name}.osm.pbf`;
cmd.to_sql = `osm2pgsql -U gis --database ${t.name} -W ${t.name}.osm.pbf -P 5432 -H localhost --cache-strategy sparse -C 500 --style ${styleFile}`;

sh.exec(cmd.download);
sh.exec(cmd.osmosis);
sh.exec(cmd.to_sql);

