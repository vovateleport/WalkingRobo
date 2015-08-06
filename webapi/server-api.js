var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 9001;
var router = express.Router();


app.use('/api', router);
router.get('/', function(req, res) {
	res.json({ message: 'Yo!' });
});

router.use("/tasks", require("./tasks"));

app.listen(port);
console.log('Api started on :'+port);