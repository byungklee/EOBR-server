var MongoClient = require('mongodb').MongoClient;
var database;


MongoClient.connect("mongodb://localhost:27017/eobrdb", function(err, db) {
  if(err) { return console.dir(err); }
  		database = db;
  		var collection = database.collection("trips");
    	db.collection('trips').find({trip_id: 20150518, truck_id:"\"0c:48:85:ce:ee:b6\""},{"sort":"id"}).toArray(function (err,items) {
    		//console.log(items);


    		var total = 0;
    		for(var i = 0;i<items.length;i++) {
    			//console.log(i);
    			if(i != items.length-1) {
    				lat1 = items[i].latitude;
    				lat2 = items[i+1].latitude;
    				lon1 = items[i].longitude;
    				lon2 = items[i+1].longitude;
    				var d = getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2);
    				console.log(d + " km");
    				total += d;
				}

    		}

    		console.log(total);

    	});

});


//Haversine formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


// db.collection('trips').find({ truck_id: query.truck_id, trip_id: parseInt(query.trip_id)},{"sort":"id"}).toArray(function(err,items) {
// 		console.log(items);
// 		res.json(items);

// });