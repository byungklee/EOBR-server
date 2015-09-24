var tripsData = []; //list of trips
var tripData=[]; //details of one trip
var markerSelectedCounter = 0; //Counter of selected markers.
var tripSelectedIndex = -1;
var previousTemp = null;

var distanceData = [];
var totalDistance;

/**
 * 	On document ready, load trip lists and set clickable.
 */
$(document).ready(function() {
	getTripsData();
	$("#triplist_table tbody").on('click', 'td', loadTrip);
});

/**
 *	Load trip data.
 */
function loadTrip(event) {
	var index = $(this).parent().index();
	var trip = tripsData[index];
	if(previousTemp != null) {
		previousTemp.toggleClass("highlighted");
	}

	$(this).parent().toggleClass("highlighted");
	previousTemp = $(this).parent();
	tripSelectedIndex = index;
	loadTripAjax(trip.truck_id, trip.trip_id);
};

function selectData(event) {
	var index = $(this). parent().index();
}

function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
  var R = 6371000; // Radius of the earth in m
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in m

  return (d / 1000 * 0.621371);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


function loadTripAjax(truck_id, trip_id) {
	$.getJSON('/trips/tripDetail?truck_id=' + truck_id + '&trip_id=' + trip_id, function(data) {
		tripData = data;
		totalDistance  = 0;
		for(var index = 0;index < data.length-1;index++) {
			distanceData[index] = getDistanceFromLatLonInM(tripData[index].latitude, tripData[index].longitude,
				tripData[index+1].latitude, tripData[index+1].longitude);
			totalDistance += distanceData[index];
		}

		/*
		people.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    	});*/
		tripData = tripData.sort(function(a,b) {
			return a.id > b.id ? 1 : ( a.id < b. id ? - 1: 0 );
		});
		var tableContent ='';
		var index =0;
		$.each(tripData, function() {
			var timeJson = JSON.parse(this.time);
			var date = timeJson.month + '-' + timeJson.day + '-' + timeJson.year;
			var timezone = timeJson.timezone == "America/Los_Angeles" ? "PMT" : timeJson.timezone;
			var time = timeJson.time + " " + timezone;
			tableContent += '<tr>';
			tableContent += '<td>' + date+ '</td>';
		//	tableContent += '<td>' + this.id + '</td>';
			tableContent += '<td>' + time + '</td>';
			tableContent += '<td>' + this.type+ '</td>';
			tableContent += '<td>' + (distanceData[index] != undefined ? distanceData[index++].toFixed(2):"") + ' M' +'</td>';
			tableContent += '</tr>';

		});
		var totalString = totalDistance != undefined ? "Total Distance = " + totalDistance.toFixed(2) + " M" : "";
		$('#total_distance').text(totalString);

		/**
		 *	Allows multiple selection by click and drag.
		 */
		$('#tripdata_table tbody').html(tableContent);
		var isMouseDown = false, // TO keep track mouse up and down.
	    isHighlighted; //To keep track highlight
	    markerSelectedCounter = 0;

		$("#tripdata_table tbody tr").mousedown(function () {
	      isMouseDown = true;
	      $(this).toggleClass("highlighted");
	      isHighlighted = $(this).hasClass("highlighted");
	      var index = $(this).index();

	      console.log(index);
	      updateMarker(index, isHighlighted);
	      return false; // prevent text selection
		 }).mouseover(function () {
		      if (isMouseDown) {
		        $(this).toggleClass("highlighted", isHighlighted);
		        var index = $(this).index();
			
					      	  
	      		console.log(index);
			     updateMarker(index, isHighlighted);
		      }
		   })
	    .bind("selectstart", function () {
	      return false;
	    });

		$(document).mouseup(function() {
			isMouseDown = false;
		});

		//DEBUG
		//console.log("TripData: " + JSON.stringify(tripData));
		loadNewTrip();
		//call map
		//$('#map_display').html(JSON.stringify(data));
	});
};

/**
 * Update marker
 */
function updateMarker(index, isHighlighted) {
	// Case 1: first marker is highlighted.
	if(markerSelectedCounter == 0 && isHighlighted) {
		// 1.1 Turn off all markers.
		for(var i in markers) {
			markers[i].setVisible(false);
		}

		// 1.2 check if selected index is visible
		if(!markers[index].getVisible()) {
			markers[index].setVisible(true);
			markerSelectedCounter++;	
		}
	}
	// Case 2: After first marker is highlighted. 
	else if(isHighlighted) {
		// 2.1 do work only if the market at index is not visible.
		if(!markers[index].getVisible()) {
			markers[index].setVisible(true);
			markerSelectedCounter++;	
		}
	} 
	// Case 3: When Marker is not highlighted.
	else if(!isHighlighted) {
		// 3.1 do work only if the market at index is visible.
		if(markers[index].getVisible()) {
			markers[index].setVisible(false);
			markerSelectedCounter--;	
		}
		// //Case 2.2: After case 2.1, none of markers is highlighted.
		// if(markerSelectedCounter == 0) {
		// 	for(var i in markers) {
		// 		markers[i].setVisible(true);
		// 	}
		// }
	}
}

function getTripsData() {
	var tableContent = '';
	$.getJSON('/trips/triplist', function(data) {
		console.log(data);
		tripsData = data;
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td>' + this.trip_id + '</td>';
		//	tableContent += '<td>' + this.id + '</td>';
			tableContent += '<td>' + this.truck_id + '</td>';
		//	tableContent += '<td>' + this.time+ '</td>';
			tableContent += '</tr>';
		});
		$('#triplist_table tbody').html(tableContent);
	});
};

function test() {
	alert("this" );
};



