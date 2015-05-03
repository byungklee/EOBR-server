var express = require('express');
var router = express.Router();

router.get('/triplist', function(req,res) {
	console.log("sending out trip list");
   var db = req.db;
   // var collection = db.get('trips');

   //db.trips.group({key:{trip_id:1,truck_id:1},reduce:function(curr,result) {},initial:{}});
   // db.collection('trips').find({type:'start'}).toArray(function (err,items) {
   // 		res.json(items);
   // });
	// db.collection('trips').group({key:{trip_id:1,truck_id:1},reduce:function(curr,result) {},initial:{}}).toArray(function (err,items) {
	// 	res.json(items);
	// });
//console.log(JSON.stringify(db.collections('trips')));
	// db.collections('trips').group(['trip_id','truck_id'], {}, {},"function(curr,result){}",function(err,result) {
	// 	res.json(result);
	// });
db.collection('trips').group(['trip_id','truck_id'],
	{},
	{},
	function(curr,result){},
 	function(err,result){res.json(result);});
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