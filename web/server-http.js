var express = require('express');

var port = 8080;
var app = express();

app.use(express.static(__dirname + '/content'));
app.listen(port);

console.log('Server listening on port ' + port);
