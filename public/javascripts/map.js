var map;
var myCs = [new google.maps.LatLng(-18.5333,55.9667),
            new google.maps.LatLng(-18.5333,60.9667),
            new google.maps.LatLng(-18.5333,65.9667),
            new google.maps.LatLng(-18.5333,70.9667),
            new google.maps.LatLng(-20.5333,75.9667)
            ];
var i = 0;
function animate() {

   setTimeout(function(){ 
    map.panTo(myCs[i]);
    i++;
    if(i < 5 ) {
      animate();
    }
   }, 3000);
}

function test() {

}

function initialize()
{
  var myC = new google.maps.LatLng(65.9667,-18.5333);
  var mapProp = {
    center: myC,
    zoom:3
    //mapTypeId:google.maps.MapTypeId.ROADMAP
  };

 map=new google.maps.Map(document.getElementById("map_display"),mapProp);

// marker=new google.maps.Marker({
//   position:myCenter,
//   animation:google.maps.Animation.BOUNCE
//   });

// marker.setMap(map);
// //animate();


  var ctaLayer = new google.maps.KmlLayer({
  //  url: 'http://axmania.iptime.org:5555/test.kml'
  });

  ctaLayer.setMap(map);
  //document.getElementById("markerStatus");
  animate();
}
google.maps.event.addDomListener(window, 'load', initialize);
