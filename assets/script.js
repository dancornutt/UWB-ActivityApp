var myEvents;
var today = moment().format("YYYY-MM-DD");
var tomorrow = moment().add(1,'days').format("YYYY-MM-DD");

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
  displayCityName(lat,lon);
}

  function getGeoHash(lat, lon) {
    return Geohash.encode(lat, lon, 6)
  }

  function getEvents(geoHash) {
    console.log(today, tomorrow)
    $.ajax({
      type:"GET",
      url:`https://app.ticketmaster.com/discovery/v2/events.json?startDateTime=${today}T00:00:00Z&endDateTime=${tomorrow}T00:00:00Z&geoPoint=${geoHash}&apikey=Br1l7WKm6rF3XAHs0vPmEIZoapMi7p8A`,
      async:true,
      dataType: "json",
      success: function(json){
        updateEventsUI([...json._embedded.events])
      },
      error: function(xhr, status, err) {
            console.log(err);
           }
    });
  }

  function updateEventsUI(data_arr){
    $("#events").empty();
    data_arr.forEach(element => {
      let newEvent = $("<li>")
        .html(`<a href=${element.url}>${element.name}</a>`);
      $("#events").append(newEvent);
    });
  }

//When current location is enabled on the browser

function displayCityName(lat,lon)
{
    let queryURL = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=fd8e3b4dd5f260d4ef1f4327d6e0279a";
    $.ajax({
        url: queryURL,
        method:"GET"
    }).then(function(response){   
        weatherInfo(response);
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

  //Click Event Handler while searching for a specific location

  $("#submit").on("click",function(event){
    event.preventDefault();
    let cityInput = $("#location").val();
    console.log(cityInput);
    getTempData(cityInput);
  })

  //When the current location is blocked on the browser, User Input is gathered from Text Box value

  function getTempData(cityInput){

    let TempapiURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityInput+"&appid=fd8e3b4dd5f260d4ef1f4327d6e0279a";
    $.ajax({
      method:"GET",
      url: TempapiURL
    }).then(function(response){
      weatherInfo(response);
    })
  }

// Function to display Weather Information 

function weatherInfo(response)
{
      var imageSrc = " http://openweathermap.org/img/wn/"+response.weather[0].icon+".png";
      $("#weather-icon").attr("src",imageSrc);
      $("#weather").html("Weather Conditions: "+ response.weather[0].main);
      $("#temp").html("Temparature: "+ (convertKtoF(response.main.temp)).toFixed(2) + "&deg;F");
      $("#wind").html("Wind Speed: "+response.wind.speed+"MPH");
      $("#location-and-date").html(response.name +"("+ convertUnixtoDate(response.dt)+")");
}


 getLocation();
