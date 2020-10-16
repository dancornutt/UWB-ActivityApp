// var myEvents;
var today = moment().format("YYYY-MM-DD");
var tomorrow = moment().add(7,'days').format("YYYY-MM-DD");
var city = "";
var maxDay = moment().add(6, 'd').format("YYYY-MM-DD")
var outdoorActivities = ["Ride a bike", "Play hopskotch", "Climb a tree", "Have a picnic", "Fly a kite", "go on a hike", "Draw with chalk", "Do tie-dye", "Play Frisbee", "Rollerskate"]
var indoorActivities = ["Bake a cake", "Play rock paper scissors", "Build a fort", "Do a puzzle", "Read a book", "Set up a scavenger hunt", "Draw", "Do Yoga", "Watch a movie", "Play hide and seek"]

function limitCalendar(){
  $("#date").attr("max", maxDay)
  $("#date").attr("min", today) 
}

limitCalendar()

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
  displayAttractions(getGeoHash(lat, lon))
  displayCityName(lat,lon);
}

function getGeoHash(lat, lon) {
  return Geohash.encode(lat, lon, 6)
}

function getEvents(geoHash) {
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

  function getEventsCityDate(city) {
    $.ajax({
      type:"GET",
      url:`https://app.ticketmaster.com/discovery/v2/events.json?startDateTime=${today}T00:00:00Z&endDateTime=${tomorrow}T00:00:00Z&city=[${city}]&apikey=Br1l7WKm6rF3XAHs0vPmEIZoapMi7p8A`,
      async:true,
      dataType: "json",
      success: function(json){
        console.log("From getEventsCityDate", json);
        updateEventsUI([...json._embedded.events])
      },
      error: function(xhr, status, err) {
            console.log(err);
           }
      });
    }

function updateEventsUI(data_arr){
  $("#events").empty();

  for (let i=0; i<10; i++) {
    let newEvent = $("<li>")
      .html(`<a href=${data_arr[i].url}>${data_arr[i].name}</a>`);
    $("#events").append(newEvent);
  }
    
  
}


//When current location is enabled on the browser
function displayCityName(lat,lon) {
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=fd8e3b4dd5f260d4ef1f4327d6e0279a";
  $.ajax({
      url: queryURL,
      method:"GET"
  }).then(function(response){   
      weatherInfo(response);
  })
}

//Temparature conversion function
function convertKtoF(tempInKelvin) {
  return ((tempInKelvin - 273.15) * 9) / 5 + 32;
}

function updateWeek(date) {
  this.today = date;
  this.tomorrow = moment(date).add(7,'days').format("YYYY-MM-DD");
}

//Convert Unix format to Standard Date
function convertUnixtoDate(unixformat) {
  var unixTimeStamp = unixformat;
  var timestampInMilliSeconds = unixTimeStamp*1000;
  var date = new Date(timestampInMilliSeconds);
  var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
  var month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
  var year = date.getFullYear();
  var formattedDate = day + '-' + month + '-' + year;
  return (formattedDate);
}

//When the current location is blocked on the browser, User Input is gathered from Text Box value
function getTempData(cityInput){
  let TempapiURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityInput+"&appid=fd8e3b4dd5f260d4ef1f4327d6e0279a";
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
  var imageSrc = " https://openweathermap.org/img/wn/"+response.weather[0].icon+".png";
  $("#weather-icon").attr("src",imageSrc);
  $("#weather").html("Weather Conditions: "+ response.weather[0].main);
  $("#temp").html("Temparature: "+ (convertKtoF(response.main.temp)).toFixed(2) + "&deg;F");
  $("#wind").html("Wind Speed: "+response.wind.speed+"MPH");
  $("#location-and-date").html(response.name +"("+ convertUnixtoDate(response.dt)+")");
  if(response.weather[0].main === "Clear" || response.weather[0].main === "Clouds"){
    $("#recommendation").text("outdoor")
  } else {
    $("#recommendation").text("indoor")
  }
}

function displayAttractions(city){
  let attractionsQueryURL = "https://www.triposo.com/api/20200803/poi.json?tag_labels=sightseeing|tous|nightlife|cuisine|do&location_id="+city+"&count=15&order_by=-score&fields=name,best_for,coordinates,score,id&account=BMUC2RQB&token=0moqmf7h8qna8hw3ijun6r9sdb8eqqow"
  $.ajax({
      url: attractionsQueryURL,
      method:"GET"
  }).then(function(response){
    console.log(response)
    $("#attractions").empty();
    let attractions = response.results
    console.log(attractions)
    if (attractions.length === 0){
      let noAttraction = $("<li>").text("No city attractions found at your location. Try one of these:")
      $("#attractions").append(noAttraction)
      if ($("#recommendation").text()==="outdoor"){
        outdoorActivities.forEach(element => {
        let outdoorActivityList = $("<li>").text(element)
        $("#attractions").append(outdoorActivityList)
        })
      } else if ($("#recommendation").text()==="indoor"){
        indoorActivities.forEach(element => {
        let indoorActivityList = $("<li>").text(element)
        $("#attractions").append(indoorActivityList)
        })
      }  
    } else {
      attractions.forEach(element => {
        let newAttraction = $("<li>")
        newAttraction.text(element.name)
        $("#attractions").append(newAttraction)
      })
    }
  })
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

//Click Event Handler while searching for a specific location
$("#submit").on("click",function(event){
  event.preventDefault();
  let cityInput = $("#location").val().toLowerCase().trim();
  getTempData(cityInput);
  updateWeek($("#date").val());
  displayAttractions(toTitleCase(cityInput));
  getEventsCityDate(cityInput)
})

getLocation();