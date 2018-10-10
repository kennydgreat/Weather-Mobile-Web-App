// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var domResolve;
var domReady = new Promise(function (resolve) {
    domResolve;
});

document.addEventListener('DOMContentLoaded', domResolve);

var cordovaResolve;
var cordovaReady = new Promise(function (resolve) {
    cordovaResolve = resolve;
});
document.addEventListener('deviceready', cordovaResolve);

Promise.all([domResolve, cordovaResolve]).then(initApp);

function initApp() {
    //Getting location
    getWeatherLocation();
    // Load the Visualization API and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Set a callback to run when the Google Visualization API is loaded.
    $("#saveBtn").click(function (event) {
        //event.preventDefault(); 
        google.charts.setOnLoadCallback(drawChart);
        console.log("setOnLoadCallback called");
        populateCollapsibles();

    });
    $("#getLocation").click(function (event) {
        //event.preventDefault(); 
        getWeatherLocation();

    });

    // Callback that creates and populates a data table,
    // draws it.
    function drawChart() {
        console.log("drawChart ran");
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Day');
        data.addColumn('number', 'Temperature');
        var i = 0;
        /*Loops through the days of the week and for each
        day there is weather info it adds a row */
        for (i = 0; i < days_of_the_week.length; i++) {
            if (day_and_temp_map.has(days_of_the_week[i])) {
                data.addRow([days_of_the_week[i], day_and_temp_map.get(days_of_the_week[i])]);
            }
        }

        // Set chart options
        var options = {
            'title': 'Weather forecast chart',
            'width': 500,
            'height': 300
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
    //Populating the collapsible widgets with the temperature 
    //data for each day
    function populateCollapsibles() {
        var $collapsibles = $('.ui-field-contain').find('p');
        console.log($collapsibles);
        for (i = 0; i < days_of_the_week.length; i++) {
            if (day_and_temp_map.has(days_of_the_week[i])) {
                $collapsibles[i].innerHTML = 'Temperature: ' + day_and_temp_map.get(days_of_the_week[i]);
                var dayId = '#' + days_of_the_week[i];
                $(dayId).collapsible("expand");
            } else {
                $collapsibles[i].innerHTML = 'The Temperature is day not avaiable.';
            }
        }
    }

}