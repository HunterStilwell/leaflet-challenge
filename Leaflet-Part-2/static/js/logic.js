// create the tile layers
var defaultLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

var secondLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'});

var thirdLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});



// create a basemaps object
let basemaps = {
    GrayScale: secondLayer,
    Topography: thirdLayer,
    Default: defaultLayer
};

// create the map object
let myMap = L.map("map", {
    center: [39.5501, -114.7821],
    zoom: 5,
    layers: [defaultLayer, secondLayer, thirdLayer]
});

// add the default layer to the map
defaultLayer.addTo(myMap);



// variable to hold the tectonic plates layer
let tectonicplates = new L.layerGroup();

// call the api to get the info for the tectonic plates
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
.then(function(plateData){
    //console.log(plateData);

    // load the data using geoJSON and add  to the tectonic plates layer group
    L.geoJson(plateData,{
        // add styling
        color: "orange",
        weight: 2
    }).addTo(tectonicplates);
});

// add the tectonic plates to the map
tectonicplates.addTo(myMap);

// add  the overlay for the tectonic plates
let overlays = {
    "Tectonic Plates": tectonicplates
};

// add the Layer control
L.control.layers(basemaps, overlays).addTo(myMap);


// save the earthquake data to a variable
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// d3 of earthquake data
d3.json(earthquakeData).then(
    data => {
        // console log of data
        console.log(data);

        let earthquakes = data.features;

        
        // for loop to determine color of circle based off of depth
        for (var i = 0; i < earthquakes.length; i++)
        {
            function circleColor(depth)
            {
            if (earthquakes[i].geometry.coordinates[2] < 10)
                return "#00ff24"
            else if (earthquakes[i].geometry.coordinates[2] >= 10 & earthquakes[i].geometry.coordinates[2] < 30)
                return "#b2ff00"
            else if (earthquakes[i].geometry.coordinates[2] >= 30 & earthquakes[i].geometry.coordinates[2] < 50)
                return "#ffe700"
            else if (earthquakes[i].geometry.coordinates[2] >= 50 & earthquakes[i].geometry.coordinates[2] < 70)
                return "#ffba00"
            else if (earthquakes[i].geometry.coordinates[2] >= 70 & earthquakes[i].geometry.coordinates[2] < 90)
                return "#ff7600"
            else if (earthquakes[i].geometry.coordinates[2] >= 90)
                return "#f00"
            };

            // if the earthquake's magnitude is 0
            if (earthquakes[i].properties.mag == 0)
            {
                // create a marker that has a radius of 1
                L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
                    color: "black",
                    fillColor: circleColor(earthquakes[i].geometry.coordinates[2]),
                    fillOpacity: 0.75,
                    radius: 1
                    // attach a popup with the location, magnitude, and depth
                    }).addTo(myMap).bindPopup("<b>Location</b>: " + earthquakes[i].properties.place + "<hr>"
                    + "<b>Magnitude: </b>" + earthquakes[i].properties.mag + "<hr>" + "<b>Depth: </b>" + earthquakes[i].geometry.coordinates[2]);
            }

            // if the earthquake has a magnitude larger than 0
            else if (earthquakes[i].properties.mag > 0)
            {
                // create a marker that has a radius of the magnitude times 15000
                L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
                    color: "black",
                    fillColor: circleColor(earthquakes[i].geometry.coordinates[2]),
                    fillOpacity: 0.75,
                    radius: (earthquakes[i].properties.mag * 15000)
                    // attach a popup with the location, magnitude, and depth
                    }).addTo(myMap).bindPopup("<b>Location</b>: " + earthquakes[i].properties.place + "<hr>"
                    + "<b>Magnitude: </b>" + earthquakes[i].properties.mag + "<hr>" + "<b>Depth: </b>" + earthquakes[i].geometry.coordinates[2]);
            }
            
        }

        // create the legend
        let legend = L.control(
            {position: "bottomright"}
        );
        
        // add the properties for the legend
        legend.onAdd = function(){
            // div for the legend to appear in the page
            let div = L.DomUtil.create("div", "info legend");

            // set up the intervals
            let intervals = ["< 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "> 90"];

            // set up the colors for the intervals
            let colors = ["#00ff24", "#b2ff00", "#ffe700", "#ffba00", "#ff7600", "#f00"];

            // create an empty array to hold labels
            let labels = [];

            // add the title for the legend
            let legendInfo = "<h1>Depth in km</h1>";
            
            // add the legendInfo to the div
            div.innerHTML = legendInfo;

            // for loop to create labels and add them to the empty list
            for (let i=0; i < intervals.length; i++)
            {
                labels.push("<li style=\"background-color: " + colors[i] + "\">" + intervals[i] + "</li>");
            };
            
            // add the labels to the div
            div.innerHTML += "<ul>" + labels.join("") + "</ul>";

            return div;

        }

        // add the legend to the map
        legend.addTo(myMap);
        
    }
    
);
