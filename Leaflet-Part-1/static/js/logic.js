let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


let myMap = L.map("map", {
    center: [39.5501, -114.7821],
    zoom: 5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json(earthquakeData).then(
    data => {
        console.log(data);

        let earthquakes = data.features;

        
        
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


            if (earthquakes[i].properties.mag == 0)
            {
                L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
                    color: "black",
                    fillColor: circleColor(earthquakes[i].geometry.coordinates[2]),
                    fillOpacity: 0.75,
                    radius: 1
                    }).addTo(myMap).bindPopup("<b>Location</b>: (" + earthquakes[i].geometry.coordinates[1] + ", " 
                    + earthquakes[i].geometry.coordinates[0] + ")" + "<hr>"
                    + "<b>Magnitude: </b>" + earthquakes[i].properties.mag + "<hr>" + "<b>Depth: </b>" + earthquakes[i].geometry.coordinates[2]);
            }

            else if (earthquakes[i].properties.mag > 0)
            {
                L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
                    color: "black",
                    fillColor: circleColor(earthquakes[i].geometry.coordinates[2]),
                    fillOpacity: 0.75,
                    radius: (earthquakes[i].properties.mag * 15000)
                    }).addTo(myMap).bindPopup("<b>Location</b>: (" + earthquakes[i].geometry.coordinates[1] + ", " 
                    + earthquakes[i].geometry.coordinates[0] + ")" + "<hr>"
                    + "<b>Magnitude: </b>" + earthquakes[i].properties.mag + "<hr>" + "<b>Depth: </b>" + earthquakes[i].geometry.coordinates[2]);
            }
            
        }

        let legend = L.control(
            {position: "bottomright"}
        );

        legend.onAdd = function(){
            let div = L.DomUtil.create("div", "info legend");

            let limits = ["< 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "> 90"];

            let colors = ["#00ff24", "#b2ff00", "#ffe700", "#ffba00", "#ff7600", "#f00"];


            let labels = [];

            let legendInfo = "<h1>Depth</h1>";
            
            div.innerHTML = legendInfo;

            for (let i=0; i < limits.length; i++)
            {
                labels.push("<li style=\"background-color: " + colors[i] + "\">" + limits[i] + "</li>");
            };
            
            
            div.innerHTML += "<ul>" + labels.join("") + "</ul>";

            return div;

        }
        legend.addTo(myMap);
        
    }
);