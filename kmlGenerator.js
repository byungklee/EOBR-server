//file io
var fs = require('fs');

function createKML(someObject) {
	//fs.open("./kmls/tmp");
	fs.exists('kml', function (exists) {
  	if(!exists)
  		fs.mkdir("kml");
	});
	var sb = "";
	sb ="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">\n" +
                "\t<Document>\n";
		var i = 1;
        for(var index in someObject.record) {
            
            record = someObject.record[index];
            sb += "\t\t<Placemark>\n";
            sb += "\t\t\t<name>point" + i + "</name>\n";
            sb += "\t\t\t<description>" + record.type + "</description>\n";
            sb += "\t\t\t<point>\n";
            sb += "\t\t\t\t<coordinates>" + record.latitude + "," + record.longitude + "</coordinates>\n";
            sb += "\t\t\t</point>\n\t\t</Placemark>\n";
            i++;
        }
        sb += "\t</Document>\n" +
                "</kml>\n";
        var record = someObject.record[0];
        var filename = record.truck_id + "-trip-id-" + record.trip_id + ".kml";

	
	fs.writeFile("kml/"+filename, sb, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    	}
	}); 

}

//Sample
//{"record":[{"trip_id":5,"id":109,"time":"11\/26\/2014 21:25:09","trip_type":"pickup_empty","longitude":-18.5333,"latitude":65.9667,"type":"start","truck_id":"08:00:27:58:ea:6c"},{"trip_id":5,"id":110,"time":"11\/26\/2014 21:25:10","trip_type":"pickup_empty","longitude":-18.5333,"latitude":65.9667,"type":"destin_filling_out_paperwork","note":"","truck_id":"08:00:27:58:ea:6c"},{"trip_id":5,"id":111,"time":"11\/26\/2014 21:25:11","trip_type":"pickup_empty","longitude":-18.5333,"latitude":65.9667,"type":"destin_terminal_gate_closed","note":"","truck_id":"08:00:27:58:ea:6c"},{"trip_id":5,"id":112,"time":"11\/26\/2014 21:25:12","trip_type":"pickup_empty","longitude":-18.5333,"latitude":65.9667,"type":"stop","truck_id":"08:00:27:58:ea:6c"},{"trip_id":5,"id":113,"time":"11\/26\/2014 21:25:12","trip_type":"pickup_empty","longitude":-18.5333,"latitude":65.9667,"type":"stop","truck_id":"08:00:27:58:ea:6c"}]}
// var jsonO = JSON.parse('{"record":[{"trip_id":5,"id":109,"time":"11\/26\/2014 21:25:09","trip_type":"pickup_empty","longitude":-18.5333,"latitude":65.9667,"type":"start","truck_id":"08:00:27:58:ea:6c"},{"trip_id":5,"id":110,"time":"11\/26\/2014 21:25:10","trip_type":"pickup_empty","longitude":-18.5333,"latitude":65.9667,"type":"destin_filling_out_paperwork","note":"","truck_id":"08:00:27:58:ea:6c"},{"trip_id":5,"id":111,"time":"11\/26\/2014 21:25:11","trip_type":"pickup_empty","longitude":-18.5333,"latitude":65.9667,"type":"destin_terminal_gate_closed","note":"","truck_id":"08:00:27:58:ea:6c"},{"trip_id":5,"id":112,"time":"11\/26\/2014 21:25:12","trip_type":"pickup_empty","longitude":-18.5333,"latitude":65.9667,"type":"stop","truck_id":"08:00:27:58:ea:6c"},{"trip_id":5,"id":113,"time":"11\/26\/2014 21:25:12","trip_type":"pickup_empty","longitude":-18.5333,"latitude":65.9667,"type":"stop","truck_id":"08:00:27:58:ea:6c"}]}');
// // console.log(jsonO);
// // console.log(jsonO.record[0].type);
// // console.log(jsonO.record[0].longitude);
// // console.log(jsonO.record[0].latitude);
// // for(var i in jsonO.record) {
// // 	console.log(jsonO.record[i]);
// // }
// createKML(jsonO);

exports.createKML = createKML;