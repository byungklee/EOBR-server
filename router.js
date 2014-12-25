var querystring = require("querystring");

function route(pathname, query) {
	console.log("About to route a request for " + pathname + " " + query);
	if(pathname == "/add") {
		console.log(querystring.parse(query)["data"]);
		var temp = querystring.parse(query)["data"];
		//temp = '[' + temp + ']';
		var jsonObj = JSON.parse(temp);
		console.log(jsonObj.data1);
	}
}

exports.route = route;
