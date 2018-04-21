var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
export default function showGMap(lat1,long1,lat2,long2){




  var mySrc = new google.maps.LatLng(lat1, long1);//Abington
  var myDest = new google.maps.LatLng(lat2, long2);//AirPort



  var mapOptions = {
    zoom: 15,
    center: mySrc
  };

  //window.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  // var marker = new google.maps.Marker({
  //                       position: mySrc,
  //                       map: window.map
  //                   });

  directionsDisplay.setMap(null);
  directionsDisplay.setMap(window.map);

showMap(mySrc,myDest,directionsService,directionsDisplay);
}

function showMap(mySrc,myDest,directionsService,directionsDisplay) {
  //alert("aa")
  var request = {
    origin: mySrc,
    destination: myDest,
    travelMode: 'TRANSIT'
  };

  directionsService.route(request, function (result, status) {

    directionsDisplay.setDirections(result);
  });

}//showMap ends
