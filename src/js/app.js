// This file was previously broken into data.js and viewModel.js, which could be done again if we can solve the asynch issue with callbacks/promises.

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
    
    var self = this;
    
    this.map = null;
    
    this.markers = [];
     
    // The filter property keeps track 
    // of the content of the input field,
    // through a data binding in index.html.
    this.filter = ko.observable('');
    
    this.listArray = ko.observableArray(JSON.parse(JSON.stringify(data.placeData)));
    
    this.listArray().forEach(function(item) {
        item.selected = ko.observable('notSelected');
    });
    
    /*this.listArray().forEach(function(item) {
        console.log(item.selected());
    });*/
    
    // This line creates a copy of the placeData array 
    // from our data model. We need to use the JSON methods
    // in order to grab the exact same content but ensuring
    // it's a copy, instead of the exact same object. 
    // If it were the latter, our Knockout methods would
    // alter our original data. 
    
    this.filteredList = ko.computed(function() {
    
        if (this.filter === '') {
            return this.listArray();
        } else {       
            this.listArray().filter(function() {
                this.listArray.remove(function (item) { 
                    return ((item.title + item.feature).indexOf(this.filter) != -1); 
                }) 
            })
        };  
    });
                                    
    // NOTE TO SELF: I think we need to try to computed() 
    // idea after all. The filter thing isn't working
    // because the length of the array (and thus the index number
    // of each entry) changes the instant something is
    // filtered out. Maybe we could also use the id instead
    // of the array index?? 
    
    // What was the problem with teh computable again?
    // maybe it was something else i hadn't figure out
    // yet at that point.
    
    // Subscribe to the filter. Wheneger it 
    // changes, do two things: update the markers
    // and update the listArray

   /* this.filter.subscribe(function(newValue) {
        
        var self = this;
         
        console.log(self.markers);
        // renew both the listArray and 
        // markers to their initial state 
        // (i.e., including all places from 
        // placeData)
        console.log(this.listArray().length + '. ');
        
        //placesArray = JSON.parse(JSON.stringify(data.placeData));
        //this.listArray(JSON.parse(JSON.stringify(data.placeData)));
        
        console.log(this.listArray().length + '. ' + data.placeData.length);
        
        markers.length = 0;
        createMarkers();
        console.log(filter());
        
        // The following code does not seem to 
        // be the right solution. It is removing
        // the wrong items, not enough items, etc.
        // I'm guessing this is because the position
        // of each item in the array is changing 
        // the instant the first item is removed...
        // therefore, I'm looking to use a computed()
        // value for this purpose instead of iterating through
        // the listArray.
        
        // Next, remove all places that don't have
        // newValue in their title or feature property
        // Need to figure out case issue.
        // Right now, doesn't always filter correctly
        // might be due to length of array changing mid-
        // process??
        
       /*for (i = 0; i < placesArray.length; i++) {
            var currentPlaceItem = this.listArray()[i],
                currentMarker = markers[i],
                currentPlace = data.placeData[i];
            console.log((currentPlace.title + currentPlace.feature).indexOf(filter()));
            if ((currentPlace.title + currentPlace.feature).indexOf(filter()) == -1) {
                console.log((currentPlace.title + currentPlace.feature).indexOf(filter()));
                console.log("removing " + currentPlaceItem.title);
                this.listArray.remove(currentPlaceItem);
                console.log(data.placeData);
            };
            // DO SOMETHING TO HIDE SELECTED MARKER
        };

    });   */


      /* this is now above  
        this.filterTrue = ko.computed(function() {
        
            if ((this.title + this.feature).indexOf(filter()) != -1) {
                return 'block'
            } else {
                return 'none'
            };
        }); 
    */
        
    
    var detailInfowindow = new google.maps.InfoWindow({
             content: 'test' // this.title
         });
    
    this.openWindow = function(marker, infowindow) {
        console.log('infowindow opened');
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');

            // Add Flickr API info here.

            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };
    
    // This function, patterned on something 
    // very similar in Udacity's coursework
    // leading up to this project, takes a color
    // and makes a marker in that hue.
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    }

    var placeIcon = makeMarkerIcon('2B6D06');
    
    this.createMarkers = function() {
        for (i = 0; i < data.placeData.length; i++) {
            var marker = new google.maps.Marker({
                position: data.placeData[i].position,
                map: this.map,
                styles: mapStyles,
                title: data.placeData[i].title,
                feature: data.placeData[i].feature,
                icon: placeIcon
            });
            this.markers.push(marker);
            marker.addListener('click', function() {
                // For some reason, "this.title" is locked
                // to be whatever the very first click was on
                console.log('this.title is ' + this.title + '. And marker.title is ' + marker.title);
                // For some reason if you keep clicking around,
                // this.title eventually becomes undefined. 
                selectPlace(this)
            });
        };
    };
          
    this.initMap = function() {
        
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: data.mapStart, 
            zoom: 13,
            styles: this.mapStyles,
            mapTypeControl: false
        });
            
        // Create markers appearing on initialize
        this.createMarkers();

    };

    // this.selectPlace is called by both 
    // list items and markers.

    // This function takes the current (selected)
    // object in the listArray, highilghts that 
    // item, calls the method to select and animate
    // the marker It selects a current list item 
    // and a current marker, highlighting the 
    // latter and animating the former, and opening
    // an infowindow on the map. 
    this.selectPlace = function(place) {
        // First remove any other selection
        // that might be in play.
        console.log(this);
        listArray().forEach(function(item) {
            console.log(listArray());
            console.log(item.title);
            console.log(item.selected);
            //item.selected('notSelected');
            console.log(item.selected);
        });
        console.log('selected! ' + place.title);

        var selectedMarker, 
            selectedListItem;
        
        // Next iterate through listArray
        // and the markers array to find the 
        // matching item.
        for (i = 0; i < listArray().length; i++) {
            console.log(listArray()[i].title);
            if (listArray()[i].title = place.title) {
                var selectedListItem = listArray()[i];
                console.log('selected! ' + selectedListItem.title);
            };
        if (!selectedListItem) {
                throw 'Invalid place selected';
            } 
        };
        
        for (i = 0; i < markers.length; i++) {
            if (markers[i].title = place.title) {
                var selectedMarker = markers[i];
            };
            
        if (!selectedMarker) {
                throw 'Invalid place selected';
            };   
        };
        
        console.log(selectedListItem.selected);
        console.log(selectedMarker.title);
        
        selectedListItem.selected('selected');
        
        // This call is not working. Should I be doing
        // detailinfowindow.open?
        // openWindow(selectedMarker, detailInfowindow);   
        detailInfowindow.open(selectedMarker); 
    };

    // I might not need the below function depending
    // on how other stuff shakes down
    this.updatePlaces = function() {
        // loop through both the markers 
        // and the list and display only 
        // the one(s) matching the filter
        // which should be recorded in data/

    };

};

var init = function() {
    ko.applyBindings(viewModel());
    initMap();
};
    
/* Need to figure out why this wasn't working:

Promise.all([data, knockout]).then(function() {
    ko.applyBindings(viewModel);
}, function() {
    document.getElementById('list').append('Failed to load required files. Please try refreshing the page.');
});
*/
