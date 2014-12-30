var express = require('express');
var router = express.Router();

router.post('/add', function(req,res) {
	//console.log(req.body);
	//req.body is json itself
	var jsonbody = req.body;
	var db = req.db;
	var collection = db.get('trips');
	
	for(var i in jsonbody.record) {
		//console.log(jsonbody.record[i]);
		collection.insert(jsonbody.record[i], {w:1}, function(err,result){});
	}


	res.send('hello world');


});

router.get('/', function(req,res) {
	console.log("somebody default");

});



module.exports = router;
