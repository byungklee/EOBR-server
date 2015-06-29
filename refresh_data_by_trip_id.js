var MongoClient = require('mongodb').MongoClient;
var dataUtil = require('./dataUtil');
var db;

var STATE_OUTSIDE = 0;
var STATE_FENCE_IN = 1;
var STATE_GATE_IN = 2;

var truck_ids = [
"0c:48:85:e9:b7:4c",
"0c:48:85:ce:ee:b6",
"58:3f:54:c0:f7:fa",
"64:89:9a:75:bc:7a",
"0c:48:85:be:3d:00"];

MongoClient.connect("mongodb://localhost:27017/eobrdb", function(err, dbb) {
  if(err) { return console.dir(err); }
  db = dbb;
  for(var i = 20150625; i < 20150629;i++) {
    for(var j = 0; j < 5; j++) {
      console.log("Trip_id: " + i + " " + "truck_ids: " + truck_ids[j]);
      refresh(i,truck_ids[j]);
    }  
  }
 // refresh();
 // for(var i = 20150609; i < 20150625; i++) {
 //  refresh(i, "0c:48:85:ce:ee:b6");
 // }
// refresh(20150609, "0c:48:85:ce:ee:b6");
 //refresh(20150609, "0c:48:85:e9:b7:4c");
});

// 0c:48:85:e9:b7:4c
// 0c:48:85:ce:ee:b6
// 58:3f:54:c0:f7:fa
// 64:89:9a:75:bc:7a
// 0c:48:85:be:3d:00


function refresh(trip,truck) {

    var existRecord;
    //print(existRecord);
    //print("Query by " + jsonbody.record[0].trip_id);

    /**
     * Retrieve all the data with the same trip_id sorte bsy id.
     */
    var dataList= [];
    db.collection('trips').find({trip_id: trip, truck_id: truck },{"sort":"id"}).toArray(function (err,items) {
      /**
       * Inside Callback after retrieving all the data,
       * Make all geofence cases to running.
       */
       console.log(items);
       if(items.length == 0) {
        return;
       }
      for(var i in items) {
        if(items[i].type == "fenceOut" || items[i].type == "fenceIn" || items[i].type == "gateIn") {
          items[i].type = "Running";
          db.collection('trips').update({id: items[i].id, truck_id: items[i].truck_id, trip_id:items[i].trip_id},
               {$set: {type:items[i].type}},{upsert:true}, function(err,result){if(!err) console.log("updated!")});
        }
      }

   //   console.log(items[0]);
      console.log("");
      console.log("");
      //print("calling trip: " + items);

      existRecord = items;

      /**
       * Set initial tripstate depending on the first element.
       */
      var tripState = 0;
      if(existRecord != null) {
         if(!dataUtil.checkDataInBoundary(existRecord[0])) {
            tripState = 0;
         } else {
            tripState = 2;
         }
      }
     // console.log("Init STATE " + tripState);
     
      for(var i in existRecord) {
        
          /**
           *  Temp has an element of data.
           */
          var temp = existRecord[i];
          if(temp.type == "Running") {
            if(tripState == STATE_OUTSIDE) {
              if(dataUtil.checkDataInFence(temp)) {
                //Next to State: Fence in.
                console.log("outside state: to fenceIN");
                temp.type = 'fenceIn';
                dataList.push(temp);
                tripState = STATE_FENCE_IN;
                console.log(temp);
                var temp2 = temp;
                db.collection('trips').update(
                  {id: temp2.id, truck_id: temp2.truck_id, trip_id:temp2.trip_id},
                  {$set: {type: temp2.type}},
                  function(err,result) { console.log(result)}
                  );
               //    db.collection('trips').findAndModify({id: temp2.id, truck_id: temp2.truck_id, trip_id:temp2.trip_id},
               // {},{type:temp2.type},{upsert:true}, function(err, doc){
               //  console.log("Result:");
               //  console.log(err);
               //  console.log(doc);
               // });
              }
            
            } else if(tripState == STATE_FENCE_IN) {
              var inFence = dataUtil.checkDataInFence(temp);
              var inBoundary = dataUtil.checkDataInBoundary(temp);
                              var temp2 = temp;

              if(!inFence && inBoundary ) {
                //Next to State: Gate in.
                console.log("fenceIn state to : gateIN");
                temp.type = 'gateIn';
                dataList.push(temp);
                tripState = STATE_GATE_IN;
                console.log(temp);
                var temp2 = temp;
                db.collection('trips').update(
                  {id: temp2.id, truck_id: temp2.truck_id, trip_id:temp2.trip_id},
                  {$set: {type: temp2.type}},
                  function(err,result) { console.log(result)}
                  );
               //  db.collection('trips').findAndModify({id: temp2.id, truck_id: temp2.truck_id, trip_id:temp2.trip_id},
               // {},{type:temp2.type},{upsert:true},function(err, doc){
               //  console.log("Result:");
               //  console.log(err);
               //  console.log(doc);
               // });
              } else if(!inFence && !inBoundary) {
                console.log("fenceIn state to : outside");
                temp.type = 'Running';
                dataList.push(temp);
                tripState = STATE_OUTSIDE;
                console.log(temp);
                var temp2 = temp;
                db.collection('trips').update(
                  {id: temp2.id, truck_id: temp2.truck_id, trip_id:temp2.trip_id},
                  {$set: {type: temp2.type}},
                  function(err,result) { console.log(result)}
                  );
              }

            } else {
              var inFence = dataUtil.checkDataInFence(temp);
              var inBoundary = dataUtil.checkDataInBoundary(temp);
              if (!inBoundary && !inFence ) {
                //Next to State: Outside.
                console.log("gate into outside");

               temp.type = 'fenceOut';
               dataList.push(temp);
                tripState = STATE_OUTSIDE;
                console.log(temp);
                 var temp2 = temp;
                 db.collection('trips').update(
                  {id: temp2.id, truck_id: temp2.truck_id, trip_id:temp2.trip_id},
                  {$set: {type: temp2.type}},
                  function(err,result) { console.log(result)}
                  );
               //  db.collection('trips').findAndModify({id: temp2.id, truck_id: temp2.truck_id, trip_id:temp2.trip_id},
               // {},{type:temp2.type},{upsert:true},function(err, doc){
               //  console.log("Result:");
               //  console.log(err);
               //  console.log(doc);
               // });
               } else if (inFence) {
                  temp.type= 'fenceIn';
                  tripState = STATE_FENCE_IN;
                  var temp2 = temp;
                  db.collection('trips').update(
                    {id: temp2.id, truck_id: temp2.truck_id, trip_id:temp2.trip_id},
                    {$set: {type: temp2.type}},
                    function(err,result) { console.log(result)}
                  );
               }
             }
          }
        
      }
   
    });

}

