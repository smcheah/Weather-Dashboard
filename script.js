// save search history


// set latest search as default values
var searchInput = "Melbourne, AU"

// for all classes with fas => change to correct icon
{/* <i class="fas fa-cloud"></i>
<i class="fas fa-cloud-sun"></i>
<i class="fas fa-cloud-sun-rain"></i>
<i class="fas fa-cloud-showers-heavy"></i>
<i class="fas fa-snowflake"></i>
<i class="fas fa-wind"></i>
<i class="fas fa-bolt"></i>
<i class="fas fa-sun"></i> */}
function changeIcons() {
    switch (iconCode) {
        case 2:
            // storm
            break;
        case 3: 
            // light rain
            break;
        case 5:
            //rain
            break;
        case 6:
            // snow
            break;
        case 7:
            // fog / haze
            break;
        case 800:
            // clear
            break;
        case 801:
        case 802:
            // few clouds
            break;
        case 803:
        case 804:
            //cloudy
            break;
        default:
            // precipitation - 900
            break;
    }
}

// on search click
$("#searchBtn").on("click", (event) => {
    event.preventDefault();
    if ($("#searchInput").val() !== "") {
        // if searchInput is not empty
        searchInput = $("#searchInput").val().trim();
    }
    
    var queryParams = {
        key: "8febbce1a0e54114bf39a5d36e0029c1",
        city: searchInput, // cityName, COUNTRY
    }

    var currentWeatherURL = "https://api.weatherbit.io/v2.0/current?" + $.param(queryParams);
    var forecastWeatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?" + $.param(queryParams);

    // current weather
    $.ajax({
        url: currentWeatherURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var data = response.data[0];
        $("#cityName").text(data.city_name + ", " + data.country_code + " (" + data.ob_time);
        $("#weather-desc").text(data.weather.code + " - " + data.weather.description)
        $("#temp").text(data.temp)
        $("#uv-index").text(data.uv)
        $("#wind-speed").text(data.wind_spd + "m/s")
        $("#humidity").text(data.rh + "%")
    })

    // weather forecast
    $.ajax({
        url: forecastWeatherURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        var data = response.data;
        for (var i = 1; i < 6; i++) {
            $("#forecast" + i).text(data[i].datetime)
            $("#temp" + i).text(data[i].temp)
            $("#humidity" + i).text(data[i].rh + "%")
        }
    })
})