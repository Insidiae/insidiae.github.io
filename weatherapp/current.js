$(document).ready(function () {
  $("#useCurrent").click(function () {
    return setLocation();
  });
  $("#searchCity").click(function () {
    return getWeather();
  });
  $("#toggleUnit").click(function () {
    return changeUnit();
  });
});

var hasResult = false;
var unit = "metric";

function setLocation() {
  $.ajax({
    url: "http://ip-api.com/json",
    type: "GET",
    dataType: "jsonp",
    success: function (data) {
      var myCity = data.city + "," + data.countryCode;
      $("#cityInput").val(myCity);
      getWeather();
    },
  });
}

function getWeather() {
  var city = $("#cityInput").val();

  if (city != "") {
    $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=" +
        unit +
        "&APPID=2289eba3206c7aae7e3b5a790362fe72",
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        hasResult = true;
        var widget = showResults(data);
        console.log(data.weather[0].main);
        switch (data.weather[0].main) {
          case "Clear":
            $("#currentMain").css(
              "background-image",
              "url(./images/weather_clearSkies.jpg)"
            );
            break;
          case "Clouds":
            $("#currentMain").css(
              "background-image",
              "url(./images/weather_scatteredClouds.jpg)"
            );
            break;
          case "Atmosphere":
            $("#currentMain").css(
              "background-image",
              "url(./images/weather_mist.jpg)"
            );
            break;
          case "Snow":
            $("#currentMain").css(
              "background-image",
              "url(./images/weather_snow.jpg)"
            );
            break;
          case "Rain":
          case "Drizzle":
          case "Thunderstorm":
            $("#currentMain").css(
              "background-image",
              "url(./images/weather_rainyDay.jpg)"
            );
            break;
          default:
            $("#currentMain").css(
              "background-image",
              "url(./images/weather_overcast.jpg)"
            );
        }
        $("#error").html("");
        $("#results").html(widget);
      },
    });
  } else {
    hasResult = false;
    $("#error").html(
      "<div class='alert alert-danger' id='errorMsg'>City field cannot be empty.</p>"
    );
    $("#results").html("");
  }
}

function changeUnit() {
  var city = $("#cityInput").val();
  if (unit == "metric") {
    unit = "imperial";
    $("#currentUnit").html("Imperial");
    if (city != "" && hasResult == true) {
      getWeather();
    }
  } else {
    unit = "metric";
    $("#currentUnit").html("Metric");
    if (city != "" && hasResult == true) {
      getWeather();
    }
  }
}

function showResults(data) {
  if (unit == "metric") {
    return (
      "<h3 class='text-center' style='padding-top:30px;'>Weather data for " +
      data.name +
      ", " +
      data.sys.country +
      ":</h3>" +
      "<p style='padding-left:40px;'><img src='http://openweathermap.org/img/w/" +
      data.weather[0].icon +
      ".png'>" +
      data.weather[0].description +
      "</p>" +
      "<p style='padding-left:40px;'><strong>Temperature:</strong> " +
      data.main.temp +
      "&deg;C</p>" +
      "<p style='padding-left:40px;'><strong>Pressure:</strong> " +
      data.main.pressure +
      " hPa</p>" +
      "<p style='padding-left:40px;'><strong>Humidity:</strong> " +
      data.main.humidity +
      "%</p>" +
      "<p style='padding-left:40px; padding-bottom: 30px;'><strong>Wind Speed:</strong> " +
      data.wind.speed +
      " meters/sec</p>"
    );
  } else {
    return (
      "<h3 class='text-center' style='padding-top:30px;'>Weather data for " +
      data.name +
      ", " +
      data.sys.country +
      ":</h3>" +
      "<p style='padding-left:40px;'><img src='http://openweathermap.org/img/w/" +
      data.weather[0].icon +
      ".png'>" +
      data.weather[0].description +
      "</p>" +
      "<p style='padding-left:40px;'><strong>Temperature:</strong> " +
      data.main.temp +
      "&deg;F</p>" +
      "<p style='padding-left:40px;'><strong>Pressure:</strong> " +
      data.main.pressure +
      " hPa</p>" +
      "<p style='padding-left:40px;'><strong>Humidity:</strong> " +
      data.main.humidity +
      "%</p>" +
      "<p style='padding-left:40px; padding-bottom: 30px;'><strong>Wind Speed:</strong> " +
      data.wind.speed +
      " miles/hour</p>"
    );
  }
}
