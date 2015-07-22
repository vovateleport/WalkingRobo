"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function _parse(file){
	var re = /\r\n|\r|\n/;
	var ar = file.split(re);
	for(var i=ar.length-1;i>=0;i--){
		ar[i]=_clearComment(ar[i]);
	}
	return ar;
}

function _convert(line){
	var re = /\S+/g;
	var matches = line.match(re);
	if (!matches || matches.length==0)
		return null;
	else if (matches.length!=4)
		throw new Error(`Error parsing line:\n${line}`);

	return {
		osmType:matches[0],
		tag:matches[1],
		dataType:matches[2],
		flags:matches[3]
	};
}

function _clearComment(str){
	var i = str.indexOf('#');
	return i>-1 ? str.slice(0,i): str;
}

function _process(styleName){
	let data=fs.readFileSync(path.resolve(__dirname, `${styleName}.style`),{encoding:'utf8'});
	return _parse(data)
		.map(_convert)
		.filter(function(x){return x!=null})
		.map(function(obj){obj.source=styleName; return obj;});
}

var def = _process ('default');
var custom = _process ('custom');

var result = {};

def.forEach(function(e){
	result[e.tag]=e;
});

custom.forEach(function(e){
	result[e.tag]=e;
});

var tags = _.keys(result).sort();

//var fd=fs.openSync(path.join(__dirname,'build','load.styles'),'w');
var rv=['#OsmType\tTag\tDataType\tFlags\t#source'];
tags.forEach(function(tag){
	let obj = result[tag];
	rv.push(`${obj.osmType}\t${obj.tag}\t${obj.dataType}\t${obj.flags}\t#${obj.source}`);
});

let fileOutput = path.resolve(__dirname, 'build','load.styles');
fs.writeFileSync(fileOutput, rv.join('\r\n'),'utf8');

