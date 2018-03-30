var viewModel = {
    
    placesArray: ko.observableArray(data.placeData),
    
    filterInput: ko.observable(''),
 
    mapStyles: [
        {
            "featureType": "administrative",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e3e3e3"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#cccccc"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
       /*a possible addition {
            "featureType": "road.highway",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "color": "#656565"
                }
            ]
        },*/
        {
            "featureType": "transit",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.station.airport",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.station.airport",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#FFFFFF"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ],
    
    map: null,
    
    markers: [],

    initMap: function() {

        console.log(this.map);
        
        viewModel.map = new google.maps.Map(document.getElementById('map'), {
            center: data.mapStart, 
            zoom: 13,
            styles: this.mapStyles,
            mapTypeControl: false
        });
      
        // Create markers appearing on initialize
        for (i = 0; i < placeData.length; i++) {
            var marker = new google.maps.Marker({
                position: data.placeData[i].position,
                map: this.map,
                styles: viewModel.mapStyles,
                title: data.placeData[i].title
            });
        markers.push(marker);
        };
        
        // Add an infoWindow to each marker either inside the above loop or in a separate loop.
        
        // Create a single infowindow that appears on clicking marker
        /* var infoWindow = new google.maps.InfoWindow({
             content: 'This is the perfect place for spying on Solar NY'
         });

         // Event listener for clicking on marker
         marker.addListener('click', function() {
             infoWindow.open(map, marker);
         });*/

     },
    
    updatePlaces: function() {
        // loop through both the markers 
        // and the list and display only 
        // the one(s) matching the filter
        // which should be recorded in data/
        
    }

};

Promise.all([data, knockout]).then(function() {
    ko.applyBindings(viewModel);
}, function() {
    document.getElementById('list').append('Failed to load required files. Please try refreshing the page.');
});

