var App = window.App || {};

(function() { 

	App.start = function(){
		getData();
	};

	App.markerArray = [];

	App.start();
	// In the following example, markers appear when the user clicks on the map.
  // Each marker is labeled with a single alphabetical character.

  function initialize(plugPoints) {

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: plugPoints[0]
    });

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function(event) {
      addMarker(event.latLng, map);
    });

    // Add a marker at the center of the map.
    var markerArray = [];
    plugPoints.forEach(function(ele, index) {
      App.markerArray.push(addMarker(ele, map));
    })

    console.log(markerArray);

    App.markerArray.forEach(function(ele, index) {
      ele.setMap(map);
      setMarkerAnimation(ele, 'mouseover', 'bounce');
      setMarkerAnimation(ele, 'mouseout', null);

      attachSecretMessage(ele, '<h2>This is the test message</h2>');
    });
  }

  // Attaches an info window to a marker with the provided message. When the
  // marker is clicked, the info window will open with the secret message.
  function attachSecretMessage(marker, secretMessage) {
    var infowindow = new google.maps.InfoWindow({
      content: secretMessage
    });

    marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);
    });
  }

  function setMarkerAnimation(marker, eventType, animationType) {
    switch (animationType) {
      case 'bounce':
        marker.addListener(eventType, function(obj) {
          this.setAnimation(google.maps.Animation.BOUNCE);
        });
        break;

      case 'drop':
        marker.addListener(eventType, function(obj) {
          this.setAnimation(google.maps.Animation.DROP);
        });
        break;

      default:
        marker.addListener(eventType, function(obj) {
          this.setAnimation(null);
        });
        break;
    }
  }

  // Adds a marker to the map.
  function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
      position: location,
    });
    return marker;
  }

  function getData() {
    var xhr = new XMLHttpRequest();
    var method = 'GET';
    var url = 'https://cls.vrvm.com/pois?id=5541&limit=10&latitude=37.7324&longitude=-121.8916';
    xhr.open(method, url, true);
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        processData(JSON.parse(this.response));
      }
    };
    xhr.send();
  }

  function processData(rawData) {
    console.log(rawData);
    var plugPoints = [];
    rawData.pois.forEach(function(ele, index) {
      plugPoints.push({ lat: ele.latitude, lng: ele.longitude })
    });
    initialize(plugPoints);
  }

})()
