var map;
var myLatLng = { lat: 28.015210, lng: -81.968631};
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 28.039465, lng: -81.949804},
    zoom: 10
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
}