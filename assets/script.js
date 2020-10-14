
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
    getEvents(getGeoHash(lat, lon));


  }

  function getGeoHash(lat, lon) {
    return Geohash.encode(lat, lon, 6)
  }

  function getEvents(geohash) {

    // $('#events-panel').show();
    // $('#attraction-panel').hide();
  
    // if (page < 0) {
    //   page = 0;
    //   return;
    // }
    // if (page > 0) {
    //   if (page > getEvents.json.page.totalPages-1) {
    //     page=0;
    //   }
    // }
    
    $.ajax({
      type:"GET",
      url:"https://app.ticketmaster.com/discovery/v2/events.json?startDateTime=2020-10-20T15:00:00Z&endDateTime=2020-10-31T15:00:00Z&geoPoint=c22yrx&apikey=Br1l7WKm6rF3XAHs0vPmEIZoapMi7p8A",
      // url:"https://app.ticketmaster.com/discovery/v2/events.json?geoPoint=c22yrx&apikey=Br1l7WKm6rF3XAHs0vPmEIZoapMi7p8A",
      
      async:true,
      dataType: "json",
      success: function(json) {
            // getEvents.json = json;
            // showEvents(json);
            console.log("Events near seattle: ", json);
           },
      error: function(xhr, status, err) {
            console.log(err);
           }
    });
  }
console.log("Seattle geohash:", Geohash.encode(47.546368, -122.3622656, 6));
//Seattle geohash: c22yrx

getLocation();
getEvents("c22yrx");
