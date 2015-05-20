var express = require('express');
var busboy = require("connect-busboy");
var multiparty = require('multiparty');
var fs = require('fs');
var router = express.Router();
var dataUtil = require('../dataUtil');

/************************************************************************
POST /add
It receives a json type of lists of locations, and insert into a mongodb

*************************************************************************/
router.get('/', function(req,res) {
  res.render('index')
});

var router_isIn = {};


router.post('/add', function(req,res) {
	//console.log(req.body);
 var db = req.db;
	//req.body is json itself
	var jsonbody = req.body;

  console.log(jsonbody.record); 

  if(jsonbody.record[0] == null) {
    /*
      Get truck id
    */
    var truck_id = jsonbody.record.truck_id;    

    console.log("Checking single json!");
    console.log("current routerIs_IN " + router_isIn[truck_id]);
    if(jsonbody.record.type == "start" || router_isIn[truck_id] == null) {
      console.log("initializing router_isIn");
      router_isIn[truck_id] = dataUtil.checkData(jsonbody.record);
    }
  // var isIn = dataUtil.checkData(jsonbody.record);
    //if is in look for gateOut.
    //if is in look for gateIn.

    if(router_isIn[truck_id] != dataUtil.checkData(jsonbody.record)) {
      if(jsonbody.record.type == "Running") {
        console.log("Found running type with fence changed");
        if(router_isIn[truck_id]) {
          console.log("putting it to fenceout");

          jsonbody.record.type = 'fenceOut';
        } else {
          console.log("putting it to fencein");
          jsonbody.record.type = 'fenceIn';
        }
        router_isIn[truck_id] = !router_isIn[truck_id];
        console.log("changing router_isIn ");
      }
    }
    db.collection('trips').insert(jsonbody.record, {w:1}, function(err,result){});
  } else {
    /**
    * Overall logic is 
      1. insert all new updates.
      2. retrieve from database.
      3. make type fence to running
      4. update database.
    */
    console.log("chekcing multiple jsons!");
   // var isIn = dataUtil.checkData(jsonbody.record[0]);


    for(var i in jsonbody.record) {
      db.collection('trips').insert(jsonbody.record[i], {w:1}, function(err,result){});
    }

    var existRecord;
    db.collection('trips').find({trip_id:jsonbody.record[0].trip_id},{"sort":"id"}).toArray(function (err,items) {
      for(var i in items) {
        if(items[i].type == "fenceOut" || items[i].type == "fenceIn") {
          items[i].type = "Running";
        }
      }
      existRecord = items;
      var isIn = false;
    if(existRecord != null) {
      isIn = dataUtil.checkData(existRecord[0]);
    }
      for(var i in existRecord) {
        if(i !== 0) {
          var temp = existRecord[i];
          if(isIn != dataUtil.checkData(temp)) {
            if(jsonbody.record.type == "Running") {
              if(isIn) {

                temp.type = 'fenceOut';
              } else {
                temp.type = 'fenceIn';
              }
              db.collection('trips').update({id: temp.id, truck_id: temp.truck_id, trip_id:temp.trip_id},
               {type:temp.type},{upsert:true});
            }
          }
          isIn = !isIn;
   // db.collection('trips').insert(temp, {w:1}, function(err,result){});
        }
      }
    });
    
    }
  res.send('Success!');
});

function insertJson(db, json) {

}

router.get('/print', function(req,res) {
  var collection = req.db.collection('trips');
  collection.find({trip_id:46},{"sort":"id"}, function(err, result) {
    if(err) {
      res.send(err);
      return;
    }
    console.log(result);
    res.send(result);
  });
});

router.get('/getTrips.json', function(req,res) {
  var collection = req.db.get('trips');
  collection.find({type:'start'},{}, function(err,result) {
    if(err) {
      res.send("error");
      return;
    }
    console.log(result);
    res.send(result);
  });
});

router.get('/getTrip', function(req,res) {

});

/*
  
  Plan to Query in Mongodb.
  1. Query for "type: 'start'" since there is only one 'start' for each trip.

  2. from their when we click any trip in UI, query for trip_id and truck_id
  Then get all the list of corresponding trip_id and truck_id.

  3.Manipulate the data however I want!
  eg: map, statistic.

  */
  router.get('/testTime', function(req,res) {
    var db = req.db;
    var collection = db.get('trips');


  // collection.distinct('trip_id',function(err,result) {
  //   if(err) {
  //     res.send("error");
  //   } else {
  //     console.log(result);
  //     if(result.length > 0) {
  //       // var temp = result[0].time;
  //       // console.log(temp);
  //       // temp = JSON.parse(temp);
  //       // console.log(temp.month);
  //       //res.send("result");
  //     } else {
  //       //res.send("Empty");
  //     }


  //   }
  // });
  
  collection.find({type:'start'},{trip_id:1,id:0, trip_type:0},function(err,result) {
    if(err) {
      res.send("error");
    } else {
      console.log(result);
      if(result.length > 0) {
        var temp = result[0].time;
        console.log(temp);
        temp = JSON.parse(temp);
        console.log(temp.month);
        //res.send("result");
      } else {
      //  res.send("Empty");
    }
  }
});

  console.log("ddc");
  res.send("Done");
  //res.send("");
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
          var newPath = __dirname + '\\..\\notes\\'+obj.originalFilename;

          console.log("New Path: " + newPath);
          fs.writeFile(newPath, data, function (err) {
            console.log(err);
            if(err) {
                console.log('not uploaded');
            }
            
          });
        });
      }
      
    });
  res.send("completed");   
});

 router.get('/', function(req,res) {
   console.log("somebody default");
   res.send('The server is running');
 });


/*
  Below are just for debugging and testing.
*/
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
