var map;
var markers = [];
var infowindow;

function initMap() {
//default map - coordinates set to new york city
var options = {
  center: {lat: 40.758896, lng: -73.985130},
  zoom: 10
};
map = new google.maps.Map(document.getElementById('map')
, options);

getCurrentLocation();

$('#searchForm').on('submit', function(event){

  event.preventDefault(); 

  var searchLoc = restaurantLocation.value; // location value from the form
  
  var ajaxParam = {
      type: $(this).attr('method'),
      url: $(this).attr('action'),
      data: $(this).serialize(),
  
      success: function(data){
      console.log(data);
      geocodeAjax(searchLoc);
      clearMarkers();

      var $backDisplayUl = $('#resultDisplay');
      $backDisplayUl.empty();
      data.forEach(function (item){
          var marker = new google.maps.Marker({
              position: {lat: item.coordinates.latitude, lng: item.coordinates.longitude},
              map: map,
              item: item
          });
          marker.addListener('click', function() {
            if (infowindow) {
              infowindow.close()
            }
            infowindow = new google.maps.InfoWindow({
              content: `<div>
                <p><strong>Name:</strong> ${marker.item.name} </p>
                <p><strong>Location:</strong> ${marker.item.location.display_address.join(',')} </p>
                <p><strong>Phone Number:</strong> ${marker.item.phone} </p>
                <p><strong>Rating:</strong> ${marker.item.rating} </p>
              </div>`
            });
            infowindow.open(map, marker);
            
          });
          markers.push(marker);
          
         $backDisplayUl.append(`<li>
          <div class='resultBox'>
            <p><strong>Name:</strong> ${item.name} </p>
            <p><strong>Location:</strong> ${item.location.display_address.join(',')} </p>
            <p><strong>Phone Number:</strong> ${item.phone} </p>
            <p><strong>Rating:</strong> ${item.rating} </p>
          </div>
            
          </li>`)


      });
      
      $('#frontDisplay').hide();
      $('#backDisplay').show();
      },
      error: function (request, status, e) {
        toastr.error("Location not specified", 'Error in request!');
      }
  }
  $.ajax(ajaxParam);
});

$('#newSearch').on('click', function(){
  $('#frontDisplay').show();
  $('#backDisplay').hide();
  markers = [];
});
}


function positionReceived(position){
  var pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    };

  //move to new center;
  map.setCenter(pos);
  createMarker(pos);
  yelpAjaxCall(pos);
  //create marker for user location
  }

  function positionNotReceived (positionError){
    var pos = {
      lat: 40.758896,
      lng: -73.985130
    };
    yelpAjaxCall(pos);

  }


function getCurrentLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionReceived, positionNotReceived);
  } else {
    alert("no geolocation");
  }
}

function createMarker (pos) {
  var markerOptions = {
    position: {lat: pos.lat, lng: pos.lng},
    map: map,
    icon: "http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png"
  }

  var marker = new google.maps.Marker(markerOptions);

}

function yelpAjaxCall (pos) {
  var ajaxParam = {
    type: "GET",
    url: "/search",
    data: {healthSearch: "food", 
    priceRange: "1", 
    latitude: pos.lat,
    longitude: pos.lng,
},
    // make this its own function
    success: function(data){

    console.log(data);
    clearMarkers();
    data.forEach(function (item){
        var marker = new google.maps.Marker({
            position: {lat: item.coordinates.latitude, lng: item.coordinates.longitude},
            map: map,
            item: item
        });

        marker.addListener('click', function() {
          console.log('Item ==>', marker.item)
          if (infowindow) {
            infowindow.close()
          }
          infowindow = new google.maps.InfoWindow({
            content: `<div>
              <p><strong>Name:</strong> ${marker.item.name} </p>
              <p><strong>Location:</strong> ${marker.item.location.display_address.join(',')} </p>
              <p><strong>Phone Number:</strong> ${marker.item.phone} </p>
              <p><strong>Rating:</strong> ${marker.item.rating} </p>
            </div>`
          });
          infowindow.open(map, marker);
          
        });
        markers.push(marker);
    });
    console.log(markers.length);
    },
    error: function (request, status, error) {
      window.alert('Error in request: ' + JSON.stringify(error));
    }

}
console.log(ajaxParam);
$.ajax(ajaxParam);
}

function geocodeAjax(location) {
  var ajaxParam = {
    type: "GET",
    url: "https://maps.googleapis.com/maps/api/geocode/json?",
    data: {
    address: location, 
    key: "AIzaSyAAuEH5odTn_sLi80l8MQ_rQ33xWCf0uSY", 
},

    success: function(data){

      var position = {lat: data.results[0].geometry.location.lat, 
        lng: data.results[0].geometry.location.lng};

      map.setCenter(position);
    },
    error: function (request, status, error) {

      toastr.error("Location not specified", 'Error in request!');
    }
}
console.log(ajaxParam);
$.ajax(ajaxParam);

}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++){
    markers[i].setMap(null);
  }
}


// Handle click event 