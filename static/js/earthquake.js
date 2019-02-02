var myMap = L.map('map').setView([0, -5], 2);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: accessToken
}).addTo(myMap);

//retrieve data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data){
    //set a function to create markers, and style the marker to adjust to data
    function marker(feature) {
        return{
        radius: markerSize(feature.properties.mag * 3),
        fillColor: colorFill(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        };
    };

    //create colors depending on magnitude
    function colorFill(magnitude){
        switch(true){
            case magnitude > 5:
                return "red";
            case magnitude > 4:
                return "orange";
            case magnitude > 3:
                return "yellow";
            case magnitude > 2:
                return "greenyellow";
            case magnitude > 1:
                return "green";
            default:
                return "white";
        };
    };

    //Find magnitude sizes
    function markerSize(magnitude){
        if(magnitude === 0) {
            return 1;
        }
        return magnitude * .5
    }
    L.geoJson(data, {
        pointToLayer: function(feature,coordinate) {
            return L.circleMarker(coordinate,marker);
        },
        style: marker,
        onEachFeature: function(feature, layer){
            layer.bindPopup(`Magnitude: ${feature.properties.mag} <br>Location:${feature.properties.place}`);
        }
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5]
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorFill(grades[i]+1) + '"></i> ' +
            (grades[i]) + '+' + '<br>' ;
    }

    return div;
};

legend.addTo(myMap);

});


