var querystring = require("querystring");
var mongoAdapter = require("./mongoAdapter");
var kmlGenerator = require("./kmlGenerator");
function route(pathname, query) {
	console.log("About to route a request for " + pathname + " " + query);
	//var temp = querystring.parse(query)["data"];
	var jsonObj = JSON.parse(query);

	if(pathname == "/add") {
		//console.log(querystring.parse(query)["data"]);
		mongoAdapter.addTrips(jsonObj);
		kmlGenerator.createKML(jsonObj);
	}
}

exports.route = route;
