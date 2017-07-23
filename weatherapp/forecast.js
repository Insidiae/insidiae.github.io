$(document).ready(function () {
    $("#currentLoc").click(function () {
        return setLocation();
    });
    $("#submitForecast").click(function () {
        return getForecast();
    });
    $("#btnUnit").click(function () {
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
            var myCity = data.city + ',' + data.countryCode;
            $("#cityInput").val(myCity);
            getForecast();
        }
    });
}

function getForecast() {
    var city = $("#cityInput").val();

    if (city != '') {
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&units=" + unit + "&cnt=5&APPID=2289eba3206c7aae7e3b5a790362fe72",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                hasResult = true;
                $("#forecastError").html("");
                var forecastTable = '';
                var forecastHeader = "<h2 class='myWhiteText' style='font-weight:bold;'> 5-Day Weather Forecast for " + data.city.name + ", " + data.city.country + "</h2>";

                for (var i = 0; i < 5; i++) {
                    forecastTable += forecastResult(data.list[i])
                }
                $("#cityResult").html(forecastHeader);
                $("#forecastData").html(forecastTable);
            }
        });

    } else {
        hasResult = false;
        $("#forecastError").html("<div class='alert alert-danger' id='errorMsg'>City field cannot be empty.</p>")
    }
}

function changeUnit() {
    var city = $("#cityInput").val();
    if (unit == "metric") {
        unit = "imperial";
        $("#forecastUnit").html("Imperial");
        if (city != '' && hasResult == true) {
            getForecast();
        }
    } else {
        unit = "metric";
        $("#forecastUnit").html("Metric");
        if (city != '' && hasResult == true) {
            getForecast();
        }
    }
}

function forecastResult(data) {
    if (unit == "metric") {
        return "<tr>" +
            "<td>" + convertDate(data.dt) + "</td>" +
            "<td>" + "<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png'>" + "</td>" +
            "<td>" + data.weather[0].description + "</td>" +
            "<td>" + data.temp.morn + "&deg;C</td>" +
            "<td>" + data.temp.eve + "&deg;C</td>" +
            "<td>" + data.pressure + " hPa</td>" +
            "<td>" + data.humidity + "%</td>" +
            "<td>" + data.speed + " meter/sec</td>" +
            "</tr>";
    } else {
        return "<tr>" +
            "<td>" + convertDate(data.dt) + "</td>" +
            "<td>" + "<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png'>" + "</td>" +
            "<td>" + data.weather[0].description + "</td>" +
            "<td>" + data.temp.morn + "&deg;F</td>" +
            "<td>" + data.temp.eve + "&deg;F</td>" +
            "<td>" + data.pressure + " hPa</td>" +
            "<td>" + data.humidity + "%</td>" +
            "<td>" + data.speed + " miles/hour</td>" +
            "</tr>";
    }
}

function convertDate(dt) {
    var convertedDate = new Date(dt * 1000);
    var myDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var myDate = convertedDate.getDate();
    var myMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var myYear = convertedDate.getFullYear();
    var myFullDate = myDay[convertedDate.getDay()] + ', ' + myMonth[convertedDate.getMonth()] + ' ' + myDate + ' ' + myYear;

    return myFullDate;
}
