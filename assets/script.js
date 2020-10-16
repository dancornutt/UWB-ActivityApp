let favoriteEvents = {};
var today = moment().format("YYYY-MM-DD");
var tomorrow = moment().add(7,'days').format("YYYY-MM-DD");
var city = "";

function initialize() {
  if (JSON.parse(localStorage.getItem("!Bored-Events") !== null)) {
    this.favoriteEvents = {...JSON.parse(localStorage.getItem("!Bored-Events"))}
  }
}

function updateFavorites() {
  localStorage.setItem("!Bored-Events", JSON.stringify(this.favorites));
}

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
  data_arr.forEach((element, index) => {
    // console.log(element);
    let newEvent = $("<li>")
      .attr("data", `${index}`)
      .html(`<a href=${element.url}>${element.dates.start.localDate}: ${element.name}</a>`);
    let addEventBtn = $("<button>")
      .attr("class", "btn btn-secondary btn-sm")
      .html("<i class='far fa-heart'></i>");
    newEvent.append(addEventBtn);
    $("#events").append(newEvent);
  });
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
}

function displayAttractions(city){
  let attractionsQueryURL = "https://www.triposo.com/api/20200803/poi.json?tag_labels=sightseeing|tous|nightlife|cuisine|do&location_id="+city+"&count=5&order_by=-score&fields=name,best_for,coordinates,score,id&account=BMUC2RQB&token=0moqmf7h8qna8hw3ijun6r9sdb8eqqow"
  $.ajax({
      url: attractionsQueryURL,
      method:"GET"
  }).then(function(response){
    console.log(response)
    $("#attractions").empty();
    let attractions = response.results
    console.log(attractions)
    if (attractions === []){
      let noAttraction = $("<li>").text("No attractions found at your location.")
      $("#attractions").append(noAttraction)
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

//Click Event Handler on events
$("#events").on("click",function(event){

  console.log($(event.target).parent())
  if ($(event.target).parent().parent()[0].attributes[0].value !== undefined) {
    $(event.target).parent().attr("class", "btn btn-primary btn-sm");
    let id = $(event.target).parent().parent()[0].attributes[0].value;
    let text = $(event.target).parent().parent()[0].innerText;
    favoriteEvents[`${id}`] = text;
    console.log(favoriteEvents);
    saveFavoriteEvents();
    }
  })

function updateFavoriteEventsUI() {
  if (favoriteEvents) {
    let keys = favoriteEvents.keys;
    keys.forEach(element => {
      //Add LI in favorites
      //Update Item in list
    });
  }
}

function saveFavoriteEvents() {
  localStorage.setItem("!Bored-Events", JSON.stringify(favoriteEvents));
  //Update UI
}
  // event.preventDefault();
  // let cityInput = $("#location").val().toLowerCase().trim();
  // getTempData(cityInput);
  // updateWeek($("#date").val());
  // displayAttractions(toTitleCase(cityInput));
  // getEventsCityDate(cityInput)


initialize();
getLocation();