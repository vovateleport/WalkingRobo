"use strict";
var c = require('../import/testc');
var _ = require('lodash');
var path = require('path');
var express = require('express');
var router = express.Router();
var fs = require("fs");
var helpers = require("./helpers");

module.exports = router;

router.get('/', function(req, res) {
	res.json({ message: 'Yo, tasks!' });
});

router.route('/:task')
	.get(getTask);

function getTask(req, res) {
	var taskName = req.params.task;

	var tf=_.find(c.tasks, function(t){return t.name==taskName;});
	if (tf==null)
		return handleError(res, `No task '${taskName}'.`);

	var file = path.resolve(c.baseDir,'build',tf.name,'import.result');
	fs.readFile(file,{encoding:'utf8'}, function(err, data){
		if (err)
			helpers.handleError(res, err);
		else
			res.json(JSON.parse(data));
	});
}



