"use strict";

var express = require('express');
var router = express.Router();

module.exports = router;

router.get('/', function(req, res) {
	res.json({ message: 'Yo, tasks!' });
});

router.route('/:task')
	.get(getTask);

function getTask(req, res) {
	var taskName = req.params.task;

	res.json({
		task:taskName,
		last: new Date(),
		output: 'ratatat'
	});
}


