// get the current location 

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
          $("#weather").html("Weather Conditions: "+ response.weather[0].main);
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
   