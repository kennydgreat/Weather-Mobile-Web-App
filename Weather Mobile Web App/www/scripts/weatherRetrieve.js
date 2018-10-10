
var days_of_the_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var day_and_temp_map = new Map();
//Key for OpenWeatherAPI Ajax call
var OpenWeatherAppKey = "d77f56508cc67d2a6ac42ab2e86d20ae";
var watchID;
//Function which make attempts location retrieval
function getWeatherLocation() {
    alert("Getting location info. Please wait.");
    //$weatehrDisplay.text(getting_location_info_message);

    // watchID = navigator.geolocation.watchPosition(onWeatherSuccess, onWeatherError, { timeout: 10000 });
    navigator.geolocation.getCurrentPosition(onWeatherSuccess, onWeatherError, { maximumAge: 30000, timeout: 30000, enableHighAccuracy: true });
    console.log("getWeather");
}


// Success callback for get geo coordinates

var onWeatherSuccess = function (position) {
    alert("Location retrieved!");
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    getWeather(Latitude, Longitude);
}

// Get weather by using coordinates

function getWeather(latitude, longitude) {

    navigator.geolocation.clearWatch(watchID);


    var queryString =
        'http://api.openweathermap.org/data/2.5/forecast?lat='
        + latitude + '&lon=' + longitude + '&units=metric' + '&appid=' + OpenWeatherAppKey;

    $.getJSON(queryString, function (results) {
        if (results.list.length) {

            $.getJSON(queryString, function (results) {
                //if JSON was success gotten get temperature readings
                if (results.list.length) {
                    getTempReadings(results);
                }

            });

        }
    }).fail(function () {
        alert("Error getting Weather info failed. Try again by tapping 'get location info' button'");
    });
}

// Error callback

function onWeatherError(error) {
    alert("Location retrieval failed. Please turn on your GSP and try again");
}
//This gets the date from a unix data stamp
function getDayFromDateTime(timeStamp) {
    var data = new Date(timeStamp);
    return data.getDay();
}

function getTimeFromDateTime(timeStamp) {
    var data = new Date(timeStamp);
    return data.getTime();
}

function getTempReadings(results) {
    var i = 0;
    var curr_day = getDayFromDateTime(results.list[0].dt_txt);
    var temp;
    // looping through the temp readings and getting the lastest reading
    //for each day
    for (i = 0; i < results.list.length; i++) {
        if (curr_day == getDayFromDateTime(results.list[i].dt_txt)) {
            temp = results.list[i].main.temp;
        } else {
            day_and_temp_map.set(days_of_the_week[curr_day], temp);
            curr_day = getDayFromDateTime(results.list[i].dt_txt);
        }
    }
}