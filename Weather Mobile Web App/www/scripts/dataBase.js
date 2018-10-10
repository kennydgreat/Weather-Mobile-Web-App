$(document).on("pagecreate", function () {

    var db, openRequest;

    var click_event = $.support.touch ? "tap" : "click";

    var dbSupported = ("indexedDB" in window) ? true : false;

    function showPopup(msg) {
        $("#pop").html("<p>" + msg + "</p>").popup("open");
        setTimeout(function () { $("#pop").popup("close"); }, 1000);
    }

    //Creating indexedDB database for weather info
    if (dbSupported) {
        var openRequest = window.indexedDB.open("myDB", 1);

        openRequest.onupgradeneeded = function (event) {

            db = openRequest.result;
            if (!db.objectStoreNames.contains("weatherInfo")) {


                db.createObjectStore("weatherInfo", { keyPath: "day" });
            }

        };
        openRequest.onsuccess = function (event) {

            db = openRequest.result;
        };

        openRequest.onerror = function (event) {
            console.dir(event);
        };

    }


    $("#saveBtn").on(click_event, function () {
        var errMsg = '';

        var i = 0;
        for (i = 0; i < days_of_the_week.length; i++) {
            //For the days in the days of the week if there is weather info for that day save in the database
            if (day_and_temp_map.has(days_of_the_week[i])) {

                var dayWeather = { day: days_of_the_week[i], temp: day_and_temp_map.get(days_of_the_week[i]) };

                // Initiate a transaction
                var transaction = db.transaction(["weatherInfo"], "readwrite");

                // No need to use in production .oncomplete and .onerror event handlers below.
                // We use it here for demonstration / debugging purposes only! -> must remove in production!
                transaction.oncomplete = function (event) {
                    console.log("Transaction Complete");
                };
                transaction.onerror = function (event) {
                    console.log("Transaction Failed");

                };

                var storeRequest = transaction.objectStore("weatherInfo").put(dayWeather);

                storeRequest.onsuccess = function () {
                };

                storeRequest.onerror = function () {
                    alert("Error while saving weather info on device");
                };
            }
        }





    });



});