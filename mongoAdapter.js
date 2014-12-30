var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/eobrDb", function(err, db) {
  if(err) { return console.dir(err); }
  database = db;
});


function add(someObject) {
	if(typeof someObject == "object") {
		var collection = database.collection("trips");
		for(var obj in someObject.record) {
			collection.insert(obj, {w:1}, function(err,result){});
		}
	}
}

function query() {

}

exports.add = add;
exports.query = query;
