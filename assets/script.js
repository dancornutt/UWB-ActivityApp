<<<<<<< HEAD

//From our class activities
=======
// get the current location 

>>>>>>> develop
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
<<<<<<< HEAD
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
=======
    displayCityName(lat,lon);
  }

  function displayCityName(lat,lon)
  {
      let queryURL = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=fd8e3b4dd5f260d4ef1f4327d6e0279a";
      $.ajax({
          url: queryURL,
          method:"GET"
      }).then(function(response){
          var imageSrc = " http://openweathermap.org/img/wn/"+response.weather[0].icon+".png";
          $("#weather-icon").attr("src",imageSrc);
          $("#temp").html("Temparature: "+ (convertKtoF(response.main.temp)).toFixed(2) + "&deg;F");
          $("#wind").html("Wind Speed: "+response.wind.speed+"MPH");
          $("#location-and-date").html(response.name +"("+ convertUnixtoDate(response.dt)+")");
         
      })
  }

  //temparature conversion function

  function convertKtoF(tempInKelvin) {
    return ((tempInKelvin - 273.15) * 9) / 5 + 32;
  }

  //Convert Unix format to Standard Date

  function convertUnixtoDate(unixformat)
  {
    var unixTimeStamp = unixformat;
    var timestampInMilliSeconds = unixTimeStamp*1000;
    var date = new Date(timestampInMilliSeconds);
    var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    var year = date.getFullYear();
    var formattedDate = day + '-' + month + '-' + year;
    return (formattedDate);
  }

   getLocation();
   
>>>>>>> develop
