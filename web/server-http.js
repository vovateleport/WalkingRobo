var express = require('express');
var path = require('path');
var serveIndex = require('serve-index');
var c = require('../import/testc.js');

var port = 8080;
var app = express();

//app.use(express.static(__dirname + '/content'));
app.use('/', serveIndex(path.resolve(c.baseDir,'build'),{icons:true, view:'details'}));
app.use(express.static(path.resolve(c.baseDir,'build')));
app.listen(port);

console.log('Server listening on port ' + port);
