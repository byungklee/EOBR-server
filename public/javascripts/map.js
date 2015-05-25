
/**
 *  Global variable for map, markers and postions.
 */ 
var map;
var markers = [];
var positions = [];
// var myCs = [new google.maps.LatLng(-18.5333,55.9667),
//             new google.maps.LatLng(-18.5333,60.9667),
//             new google.maps.LatLng(-18.5333,65.9667),
//             new google.maps.LatLng(-18.5333,70.9667),
//             new google.maps.LatLng(-20.5333,75.9667)
//             ];

//Animation Status = "run", "stop", "pause"
var animationStatus = "stop";
var animationIndex = 0;


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

/** 
 * Compute angle between two points.
 * first and second are google.map.LatLng
 */
function computeAngleFromTwoPoints(first, second) {
  var diffY = first.lat()-second.lat();
  var diffX =  first.lng()-second.lng();
 //var cal = (second.lng()- first.lng())/(second.lat()- first.lat());
  // var cal = (second.lat()- second.lat())/(second.lng()- first.lng());
  var cal = diffY/diffX;
  var tanVal = Math.atan(cal);
  var angle = tanVal * 180.0 / 3.14;
//  console.log(first + " " + first.lat() + " Calculation: " + cal + " " + tanVal +  " " + angle); 
  // console.log(first + " " + second + 
  //   " angle: " + angle + " temp: " +  diffX+ " "+ diffY);

  //Case diffY = -, diffX = +
  //return 180 +
  if(diffX >= 0.0 && diffY >= 0.0) {
      console.log("case1: " +first + " " + second + 
    " angle: " + angle + " temp: " +  diffX+ " "+ diffY);
    return 180+angle;
  } else if(diffX>=0.0 && diffY<=0.0) {
      console.log("case2: " +first + " " + second + 
    " angle: " + angle + " temp: " +  diffX+ " "+ diffY + " final angle: " + (270+(-1*angle)));
    return 180+angle;
  } else if(diffX<=0.0 && diffY <=0.0) {
      console.log("case3: " +first + " " + second + 
    " angle: " + angle + " temp: " +  diffX+ " "+ diffY);
  
        return angle;
  } else {
    console.log("case4: " +first + " " + second + 
    " angle: " + angle + " temp: " +  diffX+ " "+ diffY);
    return angle;
  }


  
}


/**
 * Create a marker with location and index(points to tripData).
 */
function createMarker(location, index) {
  
  //Choose icon image depending on a type.
  // var image = new google.maps.MarkerImage(
  //   pickIconImage(index),
  //   new google.maps.Size(8,8), //size
  //   null, //origin5
  //   null, //anchor
  //   new google.maps.Size(3,3) //scale
  // );s
  var image;
  var angle;
  
  angle = computeAngleFromTwoPoints(positions[index-1],positions[index]);
  console.log("More final angle: " + (-90.0 - angle));
  image = {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      fillColor: getColor(index-1), // change the color of fill depending on type.
      fillOpacity: 0.8,
      scale: 2,
      strokeColor: 'black',
      strokeWeight: 1,
      rotation: (-90.0 - angle)
  };

  var marker = new google.maps.Marker({
    position: positions[index-1],
    map: map,
    icon: image
  });
  attachMessage(marker,index-1);

  return marker;
  //markers.push(marker);
};

function getColor(index) {
    if(tripData[index].type == "start") {
    return "blue";
  } else if(tripData[index].type == "stop") {
    return "red";
  } else if(tripData[index].type == "Running") {
    return "green";
  } else if(tripData[index].type =="hook/unhook") {
    return "brown";
  } else if(tripData[index].type =="fenceIn") {
    return "pink";
  } else if(tripData[index].type =="fenceOut") {
    return "orange";
  } else if(tripData[index].type =="available") {
    return "lightgreen";
  } else if(tripData[index].type =="unavailable") {
    return "darkred";
  } else if(tripData[index].type =="dock_in" || tripData[index].type =="gateIn") {
    return "yellow";
  } else if(tripData[index].type =="dock_out") {
    return "brown";
  } else if(tripData[index].type =="waiting_for_dock") {
    return "darkyellow";
  } else if(tripData[index].type =="pick_up") {
    return "purple";
  } else if(tripData[index].type =="deliver") {
    return "emerald";
  } else
     return "emerald";
}

function pickIconImage(index) {

  
  if(tripData[index].type == "start") {
    return "../images/1.png";
  } else if(tripData[index].type == "stop") {
    return "../images/6.png";
  } else if(tripData[index].type == "Running") {
    return "../images/3.png";
  } else if(tripData[index].type =="hook/unhook") {
    return "../images/4.png";
  } else if(tripData[index].type =="fenceIn") {
    return "../images/5.png";
  } else if(tripData[index].type =="fenceOut") {
    return "../images/9.png";
  } else if(tripData[index].type =="available") {
    return "../images/7.png";
  } else if(tripData[index].type =="unavailable") {
    return "../images/8.png";
  } else if(tripData[index].type =="dock_in" || tripData[index].type =="gateIn") {
    return "../images/2.png";
  } else if(tripData[index].type =="dock_out") {
    return "../images/9.png";
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
/**
 *  Change current trip info to position 
 *
 */
function currentTripToPosition(tripData) {
  var positions = [];
  for(var i in tripData) {
    positions.push(new google.maps.LatLng(tripData[i].latitude, tripData[i].longitude));
  }
  return positions;
}

/**
 *  Change postions to markers.
 */
function positionsToMarkers(positions) {
  for(var i in positions) {
    //addMarker(positions[i]);
     if(i == 0) {
      continue;
     }
     var marker = createMarker(positions[i], i);
     markers.push(marker)

     if(i == positions.length - 1) {
        image = {
          url: pickIconImage(i),
          size: new google.maps.Size(8,8),
          origin: null,
          anchor: null,
          scaledSize: new google.maps.Size(3,3)
        }
        var marker2 = new google.maps.Marker({
          position: positions[i],
          map: map,
          icon: image
        });
        attachMessage(marker2,i);
        markers.push(marker2);

      };

  }
}

/**
 * Loading the selected trip information to the google map.
 *
 */
function loadNewTrip() {
   // Clean existing markers from google map.
   clearMarkers();
   
   // Load data into position array.
   positions = currentTripToPosition(tripData);
   
   // Change postions to markers
   positionsToMarkers(positions);
   
   // Set map
   setAllMap(map);
   
   // For animation.
   animationIndex=0; // initializing marker index to 0 for animation
   animationStatus = "stop";
   map.panTo(positions[animationIndex]);
}

/*
  For stock area.
*/
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

/*
  For fences
*/
var fences = [];
function setFence(path) {
  var polygon = new google.maps.Polygon({
   paths: path,
     strokeColor: '#00FF00',
   strokeOpacity: 1,
   strokeWeight: 3,
   fillColor: '#005500',
   fillOpacity: 0.6
  });
  polygon.setMap(map);
  fences.push(polygon);
}


/*
  Zoom level is between 0 ~ 21. Returning a new size depending on zoom level.
*/
function getNewScale(zoom) {
  if(zoom >= 0 && zoom <= 8)
    return new  google.maps.Size(2, 2);
  else if(zoom >=9 & zoom <=14)
    return new google.maps.Size(5, 5);
  else
    return new google.maps.Size(7, 7);
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
  for(var i in fenceAsGoogleMapPath) {
    setFence(fenceAsGoogleMapPath[i]);
  }
  /**
   * Adding a listener for zoom changes so that markers can be resized.
   */
  google.maps.event.addListener(map, "zoom_changed", function() {
    var zoom = map.getZoom();
    // set all markers with new size depending on zoom level.
    //   for(var i in markers) {
    //     markers[i].setIcon(
    //       new google.maps.MarkerImage(
    //           markers[i].getIcon().url,
    //           null, //size
    //           null, // origin
    //           null, // anchor
    //           getNewScale(zoom)
    //         )
    //     );
    // }
  });
 
}

google.maps.event.addDomListener(window, 'load', initialize);
