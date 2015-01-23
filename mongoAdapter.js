var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/eobrDb", function(err, db) {
  if(err) { return console.dir(err); }
  database = db;
}

function addTrips(someObject) {
	if(typeof someObject == "object") {
		var collection = database.collection("trips");
		for(var obj in someObject.record) {
			collection.insert(obj, {w:1}, function(err,result){});
		}
	}
}

//Ordering ex: db.trips.find($query:{trip_id: 19}, $orderby: {id:1});
//Distnct ex: db.orders.distinct( 'ord_dt', { price: { $gt: 10 } } )
//Return an array of the distinct values of the field ord_dt from the 
//documents in the orders collection where the price is greater than 10
function query() {

}

exports.add = add;
exports.query = query;
