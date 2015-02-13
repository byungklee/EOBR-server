var express = require('express');
var router = express.Router();

router.get('/triplist', function(req,res) {
	console.log("sending out trip list");
   var db = req.db;
   // var collection = db.get('trips');
   db.collection('trips').find({type:'start'}).toArray(function (err,items) {
   		res.json(items);
   });
	// collection.find({type:'start'},{}, function(err,items) {
	// 	res.json(items);
	// });
});

router.get('/tripDetail', function(req,res) {
	var query = req.query;
	console.log("sending trip detail of " + query.truck_id + " " + query.trip_id);
	
	console.log(typeof query.truck_id + " " + typeof query.trip_id);
	//08:00:27:58:ea:6c	3
	var db= req.db;
	db.collection('trips').find({ truck_id: query.truck_id, trip_id: parseInt(query.trip_id)}).toArray(function(err,items) {
		console.log(items);
		res.json(items);

	});
});

module.exports = router;