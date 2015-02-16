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
  animationStatus = "run"
  animate();
}

function animate() {
     setTimeout(function(){ 
    map.panTo(positions[animationIndex]);
    animationIndex++;
    if(animationIndex < positions.length ) {
      if(animationStatus == "run")
        startAnimation();  
    }
   }, 3000);
}

function pauseAnimation() {
  animationStatus = "pause";
}

function stopAnimation() {
  animationStatus = "stop";
  animationIndex = 0;
}

function createMarker(location, index) {

  var marker = new google.maps.Marker({
    position: location,
    map: map

  });
  attachMessage(marker,index);
  return marker;
  //markers.push(marker);
};

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
   startAnimation();
}

function initialize()
{
  var myC = new google.maps.LatLng(65.9667,-18.5333);
  var mapProp = {
    center: myC,
    zoom: 14
    //mapTypeId:google.maps.MapTypeId.ROADMAP
  };

 map=new google.maps.Map(document.getElementById("map_display"),mapProp);

// marker=new google.maps.Marker({
//   position:myCenter,
//   animation:google.maps.Animation.BOUNCE
//   });

// marker.setMap(map);
// //animate();


  // var ctaLayer = new google.maps.KmlLayer({
  // //  url: 'http://axmania.iptime.org:5555/test.kml'
  // });

  // ctaLayer.setMap(map);
  //document.getElementById("markerStatus");
  //animate();
}

google.maps.event.addDomListener(window, 'load', initialize);
