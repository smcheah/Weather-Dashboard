var date = new Date().toDateString().slice(4);
var searchHistory = [];
var searchInput = "";



// load local storage
loadHistory();

// default values on first open
if (searchHistory.length === 0) {
    searchInput = "Melbourne, AU";
    displayData(searchInput);
} else {
    searchInput = searchHistory[0].cityName + ", " + searchHistory[0].countryCode
    displayData(searchInput);
}

// when history is clicked, trigger display data with chosen search input
$("#searchHistory").on("click", function(event) {
    if( event.target.matches("button")) {
        searchInput = event.target.textContent;
        displayData(searchInput);
    }
})

// on search click
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    
    if ($("#searchInput").val().trim() !== "") {
        // if searchInput is not empty
        searchInput = $("#searchInput").val().trim();
    } else {
        return; // searchInput = searchHistory[0].cityName + ", " + searchHistory[0].countryCode
    }
    displayData(searchInput);
})

// toggle search history menu 
$("#toggle-history").on("click", function(event) {
    event.preventDefault();
    $(".history-section").toggle(200);
})

function displayData(input) {
    var queryParams = {
        key: "8febbce1a0e54114bf39a5d36e0029c1"
    }
    if (input) {
        queryParams.city = input;
    }
    var currentWeatherURL = "https://api.weatherbit.io/v2.0/current?" + $.param(queryParams);
    var forecastWeatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?" + $.param(queryParams);

    // current weather
    $.ajax({
        url: currentWeatherURL,
        method: "GET"
    }).then(function (response) {
        // console.log(response)
        var data = response.data[0];
        var icon = (data.weather.code).toString();
        changeIcon($(".main-image"), icon)
        addToHistory((data.city_name), (data.country_code))
        

        $("#cityName").text(data.city_name + ", " + data.country_code);
        $("#weather-desc").text(date + " | " + data.weather.description)
        $("#temp").text(data.temp)
        $("#uv-index").text((data.uv).toFixed(2))
        bgColorChange(($("main")), data.uv)

        $("#wind-speed").text(data.wind_spd + "m/s")
        $("#humidity").text(data.rh + "%")
    })

    // weather forecast
    $.ajax({
        url: forecastWeatherURL,
        method: "GET"
    }).then(function (response) {
        var data = response.data;
        var nextDay;
        for (var i = 1; i < 6; i++) {
            nextDay = new Date(new Date().setDate(new Date().getDate() + i))
            $("#forecast" + i).text(nextDay.toDateString().slice(4))

            var icon = (data[i].weather.code).toString();
            changeIcon($(".icon" + i), icon)
            bgColorChange($($(".forecast")[0].children[i-1]), data[i].uv)

            $("#temp" + i).text(data[i].max_temp + " / " + data[i].min_temp)
            $("#humidity" + i).text(data[i].rh + "%")
        }
    })
}

function bgColorChange(element, uv) {
    // change background based on UV Index
    if (uv < 3) {
        element.attr("style", "background-color: lightblue")
    } else if (uv < 6) {
        element.attr("style", "background-color: #ffffcc")
    } else if (uv < 8) {
        element.attr("style", "background-color: #ffcc99")
    } else if (uv < 11) {
        element.attr("style", "background-color: #ff9999")
    } else {
        element.attr("style", "background-color: #cc99ff")
    }
}

// save search searchHistory (city/country name)
function loadHistory() {
    var savedsearchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (savedsearchHistory !== null) {
        searchHistory = savedsearchHistory;
    }

    searchHistory.forEach(element => {
        var newButton = $("<button>");
        newButton.text(element.cityName + ", " + element.countryCode);
        $("#searchHistory").append(newButton)
    });
}

function addToHistory(cityName, countryCode) {
    var found = searchHistory.find( element => element.cityName === cityName && element.countryCode === countryCode )

    var location = searchHistory.findIndex( element => element.cityName === cityName && element.countryCode === countryCode )

    // if it doesn't exist
    if ( found === undefined) {
        searchHistory.unshift({cityName, countryCode});

        if ( searchHistory.length > 16 ) {
            searchHistory.pop();
        }

        // adds new button
        var newButton = $("<button>");
        newButton.text(cityName + ", " + countryCode);
        $("#searchHistory").prepend(newButton)
        
        // adds item to local storage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory))

    } else {
        if (location !== 0) {
            searchHistory.splice(location, 1);
            searchHistory.unshift({cityName, countryCode})

            $("#searchHistory").empty()
            searchHistory.forEach(element => {
                var newButton = $("<button>");
                newButton.text(element.cityName + ", " + element.countryCode);
                $("#searchHistory").append(newButton)
            });
        }
    }
}

function changeIcon(element, icon) {
    if (icon.startsWith("2")) {
        element.addClass("fa-bolt")
    } else if (icon.startsWith("3")) {
        element.addClass("fa-cloud-sun-rain")
    } else if (icon.startsWith("5")) {
        element.addClass("fa-cloud-showers-heavy")
    } else if (icon.startsWith("6")) {
        element.addClass("fa-snowflake")
    } else if (icon.startsWith("7")) {
        element.addClass("fa-smog")
    } else if (icon.startsWith("800")) {
        element.addClass("fa-sun")
    } else if (icon.startsWith("801") || icon.startsWith("802")) {
        element.addClass("fa-cloud-sun")
    } else if (icon.startsWith("803") || icon.startsWith("804")) {
        element.addClass("fa-cloud")
    } else {
        element.addClass("fa-umbrella")
    }
}