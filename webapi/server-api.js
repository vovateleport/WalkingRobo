"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

function allowCrossDomain(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	}
	else {
		next();
	}
}

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 9001;
var router = express.Router();


app.use('/api', router);

router.get('/', function(req, res) {
	res.json({ message: 'Yo!' });
});

router.use("/tasks", require("./tasks"));
router.use("/settings", require("./settings"));

router.get("/run_import", function(req,res){

});

app.listen(port);
console.log('Api started on :'+port);