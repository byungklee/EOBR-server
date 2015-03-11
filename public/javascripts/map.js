var map;
var markers = [];
var positions = [];
// var myCs = [new google.maps.LatLng(-18.5333,55.9667),
//             new google.maps.LatLng(-18.5333,60.9667),
//             new google.maps.LatLng(-18.5333,65.9667),
//             new google.maps.LatLng(-18.5333,70.9667),
//             new google.maps.LatLng(-20.5333,75.9667)
//             ];
var animationIndex = 0;

//Status = "run", "stop", "pause"
var animationStatus = "stop";

function startAnimation() {
  if(animationStatus != "run") {
    animationStatus = "run"
    animate();
  }
}

function animate() {
     setTimeout(function(){ 
    map.panTo(positions[animationIndex]);
    animationIndex++;
    if(animationIndex < positions.length ) {
      if(animationStatus == "run")
        animate();  
    }
   }, 3000);
}

function pauseAnimation() {
  if(animationStatus != "pause")
    animationStatus = "pause";
}

function stopAnimation() {
  if(animationStatus != "stop") {
    animationStatus = "stop";
    animationIndex = 0;
  }
}

function createMarker(location, index) {
 // console.log("Creating Markers: " + JSON.stringify(tripData[index]));
  var image = pickIconImage(index);
  console.log("image " + image);
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: image
  });
  attachMessage(marker,index);
  return marker;
  //markers.push(marker);
};

function pickIconImage(index) {
  if(tripData[index].type == "start") {
    return "../images/1.png";
  } else if(tripData[index].type == "stop") {
    return "../images/9.png";
  } else if(tripData[index].type == "Running") {
    return "../images/3.png";
  } else if(tripData[index].type =="hook/unhook") {
    return "../images/4.png";
  } else if(tripData[index].type =="fenceIn") {
    return "../images/5.png";
  } else if(tripData[index].type =="fenceOut") {
    return "../images/6.png";
  } else if(tripData[index].type =="available") {
    return "../images/7.png";
  } else if(tripData[index].type =="unavailable") {
    return "../images/8.png";
  } else if(tripData[index].type =="dock_in" || tripData[index].type =="gateIn") {
    return "../images/2.png";
  } else if(tripData[index].type =="dock_out") {
    return "../images/10.png";
  } else if(tripData[index].type =="waiting_for_dock") {
    return "../images/11.png";
  } else if(tripData[index].type =="pick_up") {
    return "../images/12.png";
  } else if(tripData[index].type =="deliver") {
    return "../images/13.png";
  } else
     return "../images/13.png";


}

function createTripInfo(trip) {
  var tripInfo = "";
  for(var i in trip) {
    tripInfo += i + ": " + trip[i] + "\n";
  }
  return tripInfo;
}

function attachMessage(marker, index) {
  var message = ['This', 'is', 'the', 'secret', 'message'];
  var tripInfo = createTripInfo(tripData[index]);//JSON.stringify(tripData[index]);
  var infowindow = new google.maps.InfoWindow({
    content: tripInfo
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(marker.get('map'), marker);
  });
}


function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};

function clearMarkers() {
  setAllMap(null);
  markers = [];
};

function test() {

}

function currentTripToPosition(tripData) {
  var positions = [];
  for(var i in tripData) {
    positions.push(new google.maps.LatLng(tripData[i].latitude, tripData[i].longitude));
  }
  return positions;
}

function positionsToMarkers(positions) {
  for(var i in positions) {
    //addMarker(positions[i]);
     var marker = createMarker(positions[i], i);
     markers.push(marker)
  }
}

function loadNewTrip() {
   clearMarkers();
   positions = currentTripToPosition(tripData);
   positionsToMarkers(positions);
   setAllMap(map);
   
   animationIndex=0; // initializing marker index to 0 for animation
   animationStatus = "stop";
   map.panTo(positions[animationIndex]);
}
var polygons = [];
function setGeofence(path) {
  var polygon = new google.maps.Polygon({
   paths: path,
     strokeColor: '#FF0000',
   strokeOpacity: 1,
   strokeWeight: 3,
   fillColor: '#550000',
   fillOpacity: 0.6
  });
  polygon.setMap(map);
  polygons.push(polygon);
}


function initialize()
{
  var myC = new google.maps.LatLng(33.7609627529093, -118.23950822906488);
  var mapProp = {
    center: myC,
    zoom: 14
  };
 map=new google.maps.Map(document.getElementById("map_display"),mapProp);
  for(var i in boundaryAsGoogleMapPath) {
      setGeofence(boundaryAsGoogleMapPath[i]);
  }
 
}

google.maps.event.addDomListener(window, 'load', initialize);
