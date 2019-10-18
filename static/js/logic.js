function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap
    };

    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };




    // Create the map object with options
    var map = L.map("map-id", {
        center: [40.73, -74.0059],
        zoom: 1,
        layers: [lightmap, earthquakes]
    });

    // // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);


    // create and define legend
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Earthquake Magnitude</h4>";
        div.innerHTML += '<i style="background: #002fff"></i><span><= 2.5</span><br>';
        div.innerHTML += '<i style="background: #0088ff"></i><span>2.51 - 5.4</span><br>';
        div.innerHTML += '<i style="background: #f6ff00"></i><span>5.41 - 6.0</span><br>';
        div.innerHTML += '<i style="background: #ffcc00"></i><span>6.01 - 6.9</span><br>';
        div.innerHTML += '<i style="background: #c27319"></i><span>6.91 - 7.9</span><br>';
        div.innerHTML += '<i style="background: #ff4000"></i><span>> 8.0</span><br>';


        return div;
    };

    legend.addTo(map);
}

//returns color based on magnitude
function markerColor(magnitude) {
    if (magnitude <= 2.5) {
        return "#002fff";
    } else if (magnitude <= 5.4 && magnitude > 2.5) {
        return "#0088ff";
    } else if (magnitude <= 6.0 && magnitude > 5.4) {
        return "#f6ff00";
    } else if (magnitude <= 6.9 && magnitude > 6.0) {
        return "#ffcc00"
    } else if (magnitude <= 7.9 && magnitude > 6.9) {
        return "#c27319";
    } else if (magnitude >= 8.0) {
        return "#ff4000";
    } else {
        return "#04ff00"
    }
}

function createMarkers(response) {

    // Pull the "stations" property off of response.data
    var quakes = response.features;

    var quakeMarkers = [];
    quakes.forEach(function(d) {

        quake = d.geometry.coordinates
        magnitude = d.properties.mag


        //sets fill color and radius based on magnitude
        var geojsonMarkerOptions = {
            radius: (magnitude * 5),
            fillColor: markerColor(magnitude),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };


        //create marker, bind popup
        var quakeMarker = L.circleMarker([quake[1], quake[0]], geojsonMarkerOptions)
            .bindPopup("<h3>" + d.properties.place + "<h3><h3>Magnitude: " + magnitude + "<h3>");

        // Add the marker to the quakeMarkers array
        quakeMarkers.push(quakeMarker);

    })

    console.log(quakeMarkers)

    // // Loop through the stations array
    // for (var index = 0; index < quakes.length; index++) {
    //     var quake = quakes[index];

    //     // For each station, create a marker and bind a popup with the station's name
    //     var quakeMarker = L.marker([quake.lat, quake.lon])
    //         // .bindPopup("<h3>" + quake.name + "<h3><h3>Capacity: " + quake.capacity + "<h3>");

    //     // Add the marker to the bikeMarkers array
    //     quakeMarkers.push(quakeMarker);
    // }

    // Create a layer group made from the quake markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
//   d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson", createMarkers);


quakesJson = ("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson")

d3.json(quakesJson, function(data) {
    features = data.features
    createMarkers(data)
    features = data.features
    console.log(data.features);
    // features.forEach(function(d) {


    //     coordinates = d.geometry.coordinates
    //     console.log(coordinates[0])
    //     console.log(coordinates[1]);
    // })
})