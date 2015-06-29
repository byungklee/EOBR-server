var MongoClient = require('mongodb').MongoClient;
var dataUtil = require('./dataUtil');
var database;
MongoClient.connect("mongodb://localhost:27017/eobrdb", function(err, db) {
  if(err) { return console.dir(err); }
  database = db;
 // db.collection.find({truck_id:"64:89:9a:8f:22:91"});
  console.log("concncn");
  // database.collection("trips").find({trip_id:51, truck_id: "64:89:9a:8f:22:91"},
  //  {},
  //  function(err,i) {
  //  	if(err) { console.log("error"); return;}
  // 	console.log(i);
  // })
//20150518  64:89:9a:75:bc:7a
database.collection("trips").find({trip_id:20150518, truck_id: "64:89:9a:75:bc:7a"}).sort({id:1})
	.toArray(function(err,items) {
	//console.log(items);
	console.log(items.length);
	if(items.length === 0) {
		console.log("null")
		return;
	}
	console.log(items);
		  // var isIn = dataUtil.checkData(items[0]);
		//    console.log("Init: " + isIn + " " + JSON.stringify(items[0]));
  // //if is in look for gateOut.
  // //if is in look for gateIn.
		//   for(var i in items) {
  //  		 if(i !== 0) {
  //  		   var temp = items[i];
  //  		   if(isIn != dataUtil.checkData(temp)) {
  //   	console.log("detected boundary over " + isIn);
  //   		    if(isIn) {

  //         temp.type = 'fenceIn';

  //       } else {
  //         temp.type = 'fenceOut';
  //       }
  //     }

  //     //db.collection('trips').insert(temp, {w:1}, function(err,result){});
  //   }
  // }



	});
});


//console.log(JSON.stringify(MongoClient));

// function addTrips(someObject) {
// 	if(typeof someObject == "object") {
// 		var collection = database.collection("trips");
// 		for(var obj in someObject.record) {
// 			collection.insert(obj, {w:1}, function(err,result){});
// 		}
// 	}
// }

//Ordering ex: db.trips.find($query:{trip_id: 19}, $orderby: {id:1});
//Distnct ex: db.orders.distinct( 'ord_dt', { price: { $gt: 10 } } )
//Return an array of the distinct values of the field ord_dt from the 
//documents in the orders collection where the price is greater than 10
// function query() {
// 	console.log(database);
// 	var collection = database.collection("trips");
// 	console.log(collection);

// 		database.collection('trips').find({ truck_id: "64:89:9a:8f:22:91",
// 		 trip_id: 51}).toArray(function(err,items) {
// 		console.log(items);
// 	//	res.json(items);

// 		}
// 		);

// 		 console.log("hi");
			
// }
// query();

// exports.add = add;
// exports.query = query;
