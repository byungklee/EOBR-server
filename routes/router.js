var express = require('express');
var busboy = require("connect-busboy");
var multiparty = require('multiparty');
var fs = require('fs');
var router = express.Router();
/************************************************************************
POST /add
It receives a json type of lists of locations, and insert into a mongodb

*************************************************************************/
router.post('/add', function(req,res) {
	//console.log(req.body);
	//req.body is json itself
	var jsonbody = req.body;
	var db = req.db;
	var collection = db.get('trips');
	
	for(var i in jsonbody.record) {
		collection.insert(jsonbody.record[i], {w:1}, function(err,result){});
	}
	res.send('hello world');
});

/**
 * Uploads the file. 
 */
router.post('/uploadfile', function(req,res) {
  console.log("updating mp3 at " + __dirname);

  var form = new multiparty.Form();
   form.parse(req, function(err, fields, files) {
      console.log("Files " + files);
      console.log("Files " + JSON.stringify(files));
      console.log("Fields " + fields);
      //console.log("Fields String" + JSON.stringify(fields));
      //console.log("Files2 " + files.uploadedfile[0].path);
      for(var i in files) {
        var obj = (files[i])[0];
        var path = obj.path;
        console.log("Path: " + path);
        fs.readFile(path, function (err, data) {
          // ...
          var newPath = __dirname + '/../notes/'+obj.originalFilename;
          console.log("New Path: " + newPath);
          fs.writeFile(newPath, data, function (err) {
            console.log(err);
            console.log('uploaded');
            
          });
         });
        }
      
    });
    res.send("completed");   
});

router.get('/', function(req,res) {
	console.log("somebody default");
});

router.get('/test', function(req,res) {
	res.send('<!DOCTYPE html>\n' +
'<html>\n' +
  '<head>\n'+
    '<style type="text/css">\n'+
      'html, body, #map-canvas { height: 100%; margin: 0; padding: 0;}\n'+
    '</style>\n'+
    '<script type="text/javascript"\n'+
      'src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFo5JzClLh9dPjkpp6dxMO8WWM0AcFMw4">\n'+
    '</script>\n' +
    '<script type="text/javascript">\n'+
      'function initialize() {\n' +
        'var mapOptions = {\n' +
          'center: { lat: -34.397, lng: 150.644},\n' +
          'zoom: 8\n'+
        '};\n'+
        'var map = new google.maps.Map(document.getElementById(\'map-canvas\'),\n'+
            'mapOptions);\n'+
      '}\n'+
      'google.maps.event.addDomListener(window, \'load\', initialize);\n'+
    '</script>\n'+
  '</head>\n'+
  '<body>\n'+
'<div id="map-canvas"></div>\n'+
  '</body>\n'+
'</html>\n');
});

//Using KML
router.get('/test1', function(req, res) {
  console.log('loading test1');
  res.sendFile('/Users/byung/workspace/eobr-server/views/map.html');
});
router.get('/kmlsample', function(req,res) {
  res.sendFile('/Users/byung/workspace/eobr-server/views/kmlsample.html');
});

// router.get('/sendKML.kml', function(req, res) {
//   res.setHeader("Content-Type","application/vnd.google-earth.kml+xml");
//   res.sendFile('/Users/byung/workspace/eobr-server/placemark.kml');
// });

//Not using kml, require JSON objects to populate.
router.get('/animate', function(req,res) {
  res.sendFile('/Users/byung/workspace/eobr-server/views/symbolanimate.html')
});

module.exports = router;
