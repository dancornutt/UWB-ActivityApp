//From our class activities
function getLocation() {
    // Make sure browser supports this feature
    if (navigator.geolocation) {
      // Provide our showPosition() function to getCurrentPosition
      navigator.geolocation.getCurrentPosition(showPosition);
    } 
    else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  // This will get called after getCurrentPosition()
  function showPosition(position) {
    // Grab coordinates from the given object
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log("Your coordinates are Latitude: " + lat + " Longitude " + lon);
  }

getLocation();
