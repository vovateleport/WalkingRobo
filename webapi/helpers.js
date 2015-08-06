module.exports.handleError = function(res, err){
	res.json({
		error: err
	});
}
