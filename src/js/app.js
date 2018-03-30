// This file was previously broken into data.js and viewModel.js, which could be donee again if we can solve the asynch issue with callbacks/promises.

// markerData (location, title, possibly type of place [filterable], possibly the characteristic of whether or not there is a related photo, and any photo from a nearby spot pulled from the third-party apis)

// I think the initial lat/lng, zoom, etc values required to load the map... .? Does that make sense? Or becuase it has to be loaded reight away, do we not want to bother having this in the data model? 

// Map data??? Or does this all stay in google maps

// any data required re: Flickr/etc? I don't think so.

// if the input field is more than just a search of the titles, then there will be some data options assoc.

// Which marker is highlighted(if any)
//THE RELATIONSHIP OF ABOVE LINE AND BELOW LINE IS INTERESTING....
// the current value of the input (search filter) field (i.e., what markers/list items would be currently displayed)

// 


var data = {
    mapStart: {lat: 34.0488884, lng: -118.2404842},
    
    placeData: [
        {
            title: 'Japanese Village Plaza', 
            position: {lat: 34.0488884, lng: -118.2404842}
        },
        {
            title: 'Mitsuru Cafe',
            position: {lat: 34.0489316, lng: -118.2416973}
        }
    ],
    
    filter: '',
    
    

    
};


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
        
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: data.mapStart, 
            zoom: 13,
            styles: this.mapStyles,
            mapTypeControl: false
        });
      
        // Create markers appearing on initialize
        for (i = 0; i < data.placeData.length; i++) {
            var marker = new google.maps.Marker({
                position: data.placeData[i].position,
                map: this.map,
                styles: viewModel.mapStyles,
                title: data.placeData[i].title
            });
        this.markers.push(marker);
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

/*
Promise.all([data, knockout]).then(function() {
    ko.applyBindings(viewModel);
}, function() {
    document.getElementById('list').append('Failed to load required files. Please try refreshing the page.');
});
*/
