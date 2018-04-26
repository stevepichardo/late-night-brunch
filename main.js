var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 28.039465, lng: -81.949804},
    zoom: 10
  });
}