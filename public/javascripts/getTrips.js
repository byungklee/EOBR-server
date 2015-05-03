var tripsData = []; //list of trips
var tripData=[]; //details of one trip
$(document).ready(function() {
	getTripsData();
	$("#triplist_table tbody").on('click', 'td', loadTrip);
});

function loadTrip(event) {
	var index = $(this).parent().index();
	var trip = tripsData[index];
	loadTripAjax(trip.truck_id, trip.trip_id);
};

function loadTripAjax(truck_id, trip_id) {
	//alert(truck_id + " " + trip_id);
	$.getJSON('/trips/tripDetail?truck_id=' + truck_id + '&trip_id=' + trip_id, function(data) {
		tripData = data;
		loadNewTrip();
		//call map
		//$('#map_display').html(JSON.stringify(data));
	});
};

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
		})
		$('#triplist_table tbody').html(tableContent);
		// $('#map_display').html("<p>" + JSON.stringify(data)  + "</p>");
	});
};

function test() {
	alert("this" );
};

