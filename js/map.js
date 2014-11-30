var map;
var infoWindow;
var service;
function initialize() {
  var lat=parseFloat(document.getElementById("Lat").value);
  var lng=parseFloat(document.getElementById("Long").value);  
    map = new google.maps.Map(document.getElementById('map-canvas'), {
   // center: new google.maps.LatLng(18.945781, 72.821952),
  center: new google.maps.LatLng(lat,lng),
    zoom: 15,
    styles: [
      {
        stylers: [
          { visibility: 'on' }
        ]
      },
      {
        elementType: 'labels',
        stylers: [
          { visibility: 'on' }
        ]
      }
    ]
  });
   document.getElementById("help").innerHTML="<u>HELP</u><br> Click on a Place to find out the direction & distance.<br>";
  // The following creates a marker in the provided Coordiantes
// using a DROP animation. Clicking on the marker will toggle
// the animation between a BOUNCE animation and no animation.
  var marker = new google.maps.Marker({
  position: new google.maps.LatLng(lat,lng),
  map: map,
  animation: google.maps.Animation.DROP,
  title:"You're Here!"
  });
  //google.maps.event.addListener(marker,'click', toggleBounce);
 
  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
 
}

function performSearch() {
  var type=[];
  for(var i=0;i< document.checks.checkgroup.length;i++)
  {
     if(document.checks.checkgroup[i].checked == true)
   {
    type.push(document.checks.checkgroup[i].value);
   }
  }
  var request = {
    bounds: map.getBounds(),
    types: type,
  radius:100
  
  };
  service.radarSearch(request, callback);
}

function callback(results, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  for (var i = 0, result; result = results[i]; i++) {
    createMarker(result);
  }
}

function createMarker(place) {

   var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      // Star
      path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
      fillColor: '#ffff00',
      fillOpacity: 1,
      scale: 1/4,
      strokeColor: '#bd8d2c',
      strokeWeight: 1
    }
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    
  var lat=parseFloat(document.getElementById("Lat").value);
  var lng=parseFloat(document.getElementById("Long").value);  
//METHOD 1    
     //directionDisplay.setMap(null); //To remove any previous directions   
        directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer(
    {
       suppressMarkers: true,
       suppressInfoWindows: false
    });
    directionsDisplay.setMap(map);
    var request = {
       origin:new google.maps.LatLng(lat,lng),
       destination:result.geometry.location,
       travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status)
    {
       if (status == google.maps.DirectionsStatus.OK)
       {
        directionsDisplay.setDirections(response);
        distance = "The distance between the two points on the chosen route is: "+response.routes[0].legs[0].distance.text;
        distance += ".<br>The aproximative driving time is: "+response.routes[0].legs[0].duration.text;
        document.getElementById("help").innerHTML="<u>HELP</u><br><b>"+distance+"</b>";
        document.getElementById("modal-body").innerHTML=distance;
        $('.modal').modal('show')

       }
       
    });
  });
  });
}
//This is for asynchronous loading of the Map ie when the SUBMIT button is clicked instead of loading it at the start only or after refreshing the page
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places,visualization,geometry&' +
      'callback=initialize';
  document.body.appendChild(script);
  $('html, body').animate({scrollTop:$(document).height()}, 'slow');
        
}
submit.onclick = loadScript;
