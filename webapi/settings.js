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
	res.json({ message: 'Yo, settings!' });
});

router.route('/fields')
	.get(getFields)
	.post(postFields);

function getFields(req, res) {
	var file = path.resolve(c.baseDir, c.stylesFile2);

	fs.readFile(file,{encoding:'utf8'}, function(err, data){
		if (err)
			helpers.handleError(res, err);
		else
			res.json(JSON.parse(data));
	});
}

function postFields(req, res, next){
	var file = path.resolve(c.baseDir, c.stylesFile2);
	console.log('postFields_', req.body);
	var obj = {
		addFields: req.body.addFields,
		removeFields: req.body.removeFields
	};

	fs.writeFile(file,JSON.stringify(obj), {encoding:'utf8'}, function(err){
		if (err)
			next(err);
		else
			res.status(201).json(obj);
	});
}



