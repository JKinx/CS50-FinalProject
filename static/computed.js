
// if map is being loaded for the first time or not
first_load = true;

// intializes map
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center:  {lat: 42.377, lng: -71.126} // Cambridge, Massachussetts
    });

    // set map to div with id = map
    directionsDisplay.setMap(map);

    // event handler callback
    var onChangeHandler = function() {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    // call onChangeHandler on link click
    $("#directions-button").click(onChangeHandler
    );
    $("#map-button").click(onChangeHandler
    );
    

}

//  calculate and display route
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: start,
      destination: end,
      waypoints: waypts,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        // display the route, insert directions and trigger map resize on first load, otherwise just resize
        directionsDisplay.setDirections(response);
        
        if (first_load) {
            insertDirections(response);
            first_load = false;
        }
        google.maps.event.trigger(map,'resize'); 
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    }

// inser directions into div with id "directions" on call
function insertDirections (response) {

  // obtain tour legs object
  var legs = response["routes"][0]["legs"];

  // append html with directions into directions div
  for (var i = 0, len = legs.length; i < len; i++) {
      $("#directions").append("<h4> <i class='material-icons' >radio_button_unchecked</i> <b>Start:</b><font style='color: #555; font-weight: 400'>".concat(legs[i]["start_address"],"</font></h4><h4> <i class='material-icons'>place</i><b> End: </b> <font style='color: #555; font-weight: 400'>",legs[i]["end_address"], " </font></h4> <h5 style='font-size: 1.1em'> <i class='material-icons' >space_bar</i><b> Distance: </b><font style='color: #555; font-weight: 400'>",legs[i]["distance"]["text"], " </font>  <i class='material-icons' >access_time</i>  <b> Duration:</b><font style='color: #555; font-weight: 400'> ",legs[i]["duration"]["text"], "</font></h5>" ));
      $("#directions").append("<h5 style='font-size: 1.1em'> <i class='material-icons' >directions_car</i> <b> Directions: </b></h5>");
      
      for (var j = 0, length = legs[i]["steps"].length; j < length ; j++) {
          $("#directions").append("<li style='color: #555; font-weight: 400' >".concat(legs[i]["steps"][j]["instructions"], "</li>"));
      }

      $("#directions").append("<br>");
  }

  // set first load to false
  first_load = false;
}
