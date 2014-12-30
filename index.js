var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

var routes = require('./routes/router');
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

// DB SETTUP
var mmongo = require('mongodb');
var mon = require('monk');
var db = mon('localhost:27017/eobrdb'); // NOTE that 27017 is default port MongoDB

// *** Minimal Express Server ***
app.set('port', process.env.PORT || 8888);
// *** add the static middleware before you declare any routes ***
app.use(express.static(__dirname + '/public'));

// Make our db accessible to our router
app.use(function(req,res,next) {
	req.db = db;
	next();
})

// *** ROUTITING ***
app.use('/', routes);
// *** END OF ROUTING ***



// custom 404 page (404 page not found error)
app.use(function(req, res) {
	res.type('text/plain');
	res.status(404);
	res.send('404-Not Found');
});

// custom 500 page (500 internal server error)
app.use(function(err, req, res, next) {
	console.error(err.stack);
	//res.type('text/plain');
	res.status(500);
	res.render('500');
	//res.send('500 - Server Error');
});

app.listen(app.get('port'), function() {
	console.log("Express started on http://localhost:" + app.get('port') + "; press Ctrl-C to terminate");
});

