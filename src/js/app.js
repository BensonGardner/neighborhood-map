// This file was previously broken into data.js and viewModel.js, which could be donee again if we can solve the asynch issue with callbacks/promises.

// markerData (location, title, possibly type of place [filterable], possibly the characteristic of whether or not there is a related photo, and any photo from a nearby spot pulled from the third-party apis)

// I think the initial lat/lng, zoom, etc values required to load the map... .? Does that make sense? Or becuase it has to be loaded reight away, do we not want to bother having this in the data model? 

// Map data??? Or does this all stay in google maps

// any data required re: Flickr/etc? I don't think so.

// if the input field is more than just a search of the titles, then there will be some data options assoc.

// Which marker is highlighted(if any)
//THE RELATIONSHIP OF ABOVE LINE AND BELOW LINE IS INTERESTING....
// the current value of the input (search filter) field (i.e., what markers/list items would be currently displayed)

// consider including with each place a single line about what makes it remarkable, like "Dango" "Anime Idol Competition" -- this could tie in the photos nicely. 


var data = {
    mapStart: {lat: 34.0488884, lng: -118.2404842},
    
    placeData: [
        {
            title: 'Japanese Village Plaza', 
            position: {lat: 34.0488884, lng: -118.2404842},
            feature: 'Anime Idol Competition'
        },
        {
            title: 'Mitsuru Cafe',
            position: {lat: 34.0489316, lng: -118.2416973},
            feature: 'Delicious sweet/salty dango'
        },
        {
            title: 'test',
            position: {lat: 34.5, lng: -118.5},
            feature: ''
        }
    ],
    
};


var viewModel = function() {
    
    this.mapStyles = [
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
       /* {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },*/
        {
            "featureType": "road",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#f4f4f4"
                },
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "visibility": "off"
                },
                {
                    "color": "#222222"
                },
            ]
        },
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
    ];
    
    this.map = null;
    
    this.markers = [];

    /* think not doing this 
    this.updateMarkers = function() {
        for (i = 0; i < this.markers; i++) {
            markers.forEach(function() {
                this.visibility = "off";
                if (this.filter) {
                    this.visibility = "on";
                };
            })
        }
    }; */
     
    this.selectPlace = function() {
        console.log('selected! ' + this.title);
        
        // Needs to be called by either a
        // list item or a marker
        // Needs to select that marker and 
        // that list item (through a similar id?)
        // , toggle the selected class on the li,
        //  toggle the infoWindow visibility on the marker, and activate the  marker animation.
    };
    
    this.createMarkers = function() {
        for (i = 0; i < data.placeData.length; i++) {
            var marker = new google.maps.Marker({
                position: data.placeData[i].position,
                map: this.map,
                styles: viewModel.mapStyles,
                title: data.placeData[i].title,
                filter: data.placeData[i].filter
            });
            this.markers.push(marker);
        };
    };
    
    // The filter property keeps track 
    // of the content of the input field.
    // Although we'll use nothing but knockout 
    // bindings to update the list, we'll 
    // store the value in this variable for 
    // filtering the map markers.
    this.filter = ko.observable('');
    
    this.placesArray = data.placeData;
    
    this.listArray = ko.observableArray(placesArray);
    
    // Subscribe to the filter. Wheneger it 
    // changes, do two things: update the markers
    // and update the listArray
    this.filter.subscribe(function(newValue) {
        // renew both the listArray and 
        // markers to their initial state 
        // (i.e., including all places from 
        // placeData)
        console.log(listArray().length + '. ' + placesArray.length + '. ' + data.placeData.length);
        listArray(data.placeData);
        
        markers.length = 0;
        createMarkers();
        console.log(filter());
        
        // Next, remove all places that don't have
        // newValue in their title or feature property
        // Need to figure out case issue.
        // Right now, doesn't always filter correctly
        // might be due to length of array changing mid-
        // process??
        
        for (i = 0; i < data.placeData.length; i++) {
            var currentPlaceItem = listArray()[i],
                currentMarker = markers[i],
                currentPlace = data.placeData[i];
            console.log(currentPlaceItem);
            console.log(currentMarker);
            console.log(currentPlace);
            console.log((currentPlace.title + currentPlace.feature).indexOf(filter()));
            if ((currentPlace.title + currentPlace.feature).indexOf(filter()) == -1) {
                console.log((currentPlace.title + currentPlace.feature).indexOf(filter()));
                console.log("removing " + currentPlaceItem.title);
                listArray.remove(currentPlaceItem);
                console.log(data.placeData);
            };
            // DO SOMETHING TO HIDE SELECTED MARKER
        };
    });
        
   /* not using this method this.filterTrue = ko.computed(function() {
        //var self = this;
        if ((this.title +   this.feature).indexOf(self.filter) != -1) {
            return 'block'
        } else {
            return 'none'
        };
    }); */
    
    // WON'T NEED THIS NOW - 
    // DELETE AFTER I MAKE SURE I'M RIGHT
    // Doing this with bindings now
    // filter: function() {}, // I'm not sure if this is 
    // atually a function, or if there's
    // some other way to handle it using 
    // the text-input binding. 
    // The idea, is typing in the search box
    // will trigger (Thru ko) a function
    // that seearches for that value in the 
    // values (titels and the "notable draws" fields)
    // and if the match is false, removes those
    // items from the array - while at the same time
    // calling the googleMap API to hide the equivalent
    // markers. 
        
    this.initMap = function() {
        
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: data.mapStart, 
            zoom: 13,
            styles: this.mapStyles,
            mapTypeControl: false
        });
      
        // Create markers appearing on initialize
        
        this.createMarkers();
        
        // Add an infoWindow to each marker either inside the above loop or in a separate loop.
        
        // Create a single infowindow that appears on clicking marker
        /* var infoWindow = new google.maps.InfoWindow({
             content: 'This is the perfect place for spying on Solar NY'
         });

         // Event listener for clicking on marker
         marker.addListener('click', function() {
             infoWindow.open(map, marker);
         });*/

     };
    
    this.updatePlaces = function() {
        // loop through both the markers 
        // and the list and display only 
        // the one(s) matching the filter
        // which should be recorded in data/
        
    };

};

console.log(viewModel);

ko.applyBindings(viewModel());

/*
Promise.all([data, knockout]).then(function() {
    ko.applyBindings(viewModel);
}, function() {
    document.getElementById('list').append('Failed to load required files. Please try refreshing the page.');
});
*/
