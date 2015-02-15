var map;
var markers = [];
var positions = [];
// var myCs = [new google.maps.LatLng(-18.5333,55.9667),
//             new google.maps.LatLng(-18.5333,60.9667),
//             new google.maps.LatLng(-18.5333,65.9667),
//             new google.maps.LatLng(-18.5333,70.9667),
//             new google.maps.LatLng(-20.5333,75.9667)
//             ];
var i = 0;
function animate() {
   setTimeout(function(){ 
    map.panTo(positions[i]);
    i++;
    if(i < positions.length ) {
      animate();
    }
   }, 3000);
}

function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
};

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
    addMarker(positions[i]);
  }
}

function loadNewTrip() {
   clearMarkers();
   positions = currentTripToPosition(tripData);
   positionsToMarkers(positions);
   setAllMap(map);
   animate();
}

function initialize()
{
  


  var myC = new google.maps.LatLng(65.9667,-18.5333);
  var mapProp = {
    center: myC,
    zoom:4
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
