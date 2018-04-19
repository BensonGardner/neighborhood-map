// This file was previously broken into data.js and viewModel.js, which could be done again if we can solve the asynch issue with callbacks/promises.


var data = {
    mapStart: {lat: 34.0488884, lng: -118.2404842},
    
    placeData: [
        {
            title: 'Japanese Village Plaza', 
            position: {lat: 34.0488884, lng: -118.2404842},
            feature: 'Anime Idol Competition',
            selected: false
        },
        {
            title: 'Mitsuru Cafe',
            position: {lat: 34.0489316, lng: -118.2416973},
            feature: 'Delicious sweet/salty dango',
            selected: false
        },
        {
            title: 'test',
            position: {lat: 34.5, lng: -118.5},
            feature: '',
            selected: false
        }
    ],
    
};

var viewModel = function() {
    
    var self = this;
    
    this.filterWords = [];
    
    this.selectPlace = function() {
        // Needs to be called by 
        // list item 
            
        // Select that marker and 
        // that list item (through a similar id?),
        // toggle the selected class on the li,
        // toggle the infoWindow visibility on the marker, 
        // and activate the  marker animation.
    };
    
    // The filter property keeps track 
    // of the content of the input field,
    // through a data binding in index.html.
    this.filter = ko.observable('');
    
    // Make a copy of the placeData array so we can alter
    // it as needed.
    // In future, this may be updated with a 
    // newer ECMA option.
    this.listArray = ko.observableArray(JSON.parse(JSON.stringify(data.placeData))); 
    
    this.listArray().forEach(function(item) {

        // Determine whether each item should be filtered in
        // (i.e. displayed in the list) by using a ko.computed 
        // observable.
        item.filteredIn = ko.computed(function(){
            // Break the text input into an array of separate 
            // words, case insensitive.
            self.filterWords = filter().toLowerCase().split(' ');
            
            // Put all the item together in case insensitive fashion.
            var itemInfo = (item.title + ' ' + item.feature).toLowerCase();
            
            // Use indexOf() to search itemInfo for each word
            // from the text input. indexOf() will return a 
            // value of 0 or more indicating the spot where the 
            // search term appears, or -1 if it doesn't appear.
            
            // In that case, the lowest value for a word that does
            // appear in itemInfo is 0, but we want all appearing words
            // to return a truthy value, so we'll add 1. The 
            // non-appearing words will go from -1 to 0, which is fine
            // because that's still falsey.  

            // We only want list items to appear if every word matches.
            // That is, a zero for any search term should yield a zero 
            // overall. So, using the loop below, we'll multiply the values
            // for each search term to get an overall value that will be
            // zero if any of the words doesn't appear.
            
            var value = 1;
            for (i = 0; i < self.filterWords.length; i++) {
                value *= (itemInfo.indexOf(self.filterWords[i]) + 1);
            };
            return value;
        });
    });

    window.addEventListener('input', function(event) {
        console.log('input happened');
        mapControl.renderMarkers(self.filterWords);
    });
};

var mapControl = {
    
    map: null,
    
    markers: [],

    initMap: function() {

        this.map = new google.maps.Map(document.getElementById('map'), {
                center: data.mapStart, 
                zoom: 13,
                styles: mapStyles,
                mapTypeControl: false
            });

        // Create image for marker icon
        this.markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|2B6D06|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34)
        );
        
        // Create markers appearing on initialize

        this.renderMarkers([]);

    },

    selectPlace: function(place) {
        // First remove any other selection
        // that might be in play.
        
        // Then update which place is selected and re-render markers
        
    
        mapControl.renderMarkers(viewModel.filterWords);

        // Then open the right infowindow
        
        mapControl.detailInfowindow.open(map, selectedMarker); 
    
    },
        
   renderMarkers: function(filterArray) {
        
       // First delete all existing markers.
       
       this.markers.forEach(function(element) {
           element.setMap(null);
       });
       
        // NOTE: Does the fact that this function is called
        // from an event Listener set up within the viewModel break
        // the rule of not having Knockout handle the Maps API?
            
        for (i = 0; i < data.placeData.length; i++) {
            console.log(data.placeData.length);
            console.log(data.placeData[i]);
            var marker = new google.maps.Marker({
                position: data.placeData[i].position,
                map: this.map,
                title: data.placeData[i].title,
                feature: data.placeData[i].feature,
                icon: this.markerImage
            });
                         
            // Using the filterWords/filterArray value 
            // passed to the function, render only the markers
            // we want. 

            // We'll use a similar technique to filter the markers
            // as we used to filter the list in the viewModel.

            var markerInfo = (marker.title + ' ' + marker.feature).toLowerCase();
            console.log(markerInfo);
            var value = 1;
            for (j = 0; j < filterArray.length; j++) {
                value *= (markerInfo.indexOf(filterArray[j]) + 1);
            }
            
            console.log(marker.title + ' value is ' + value + ' or ' +  Boolean(value));
            
            
            // Set the marker to be visible only if the value
            // is true, then add it to the markers array.
            marker.setVisible(Boolean(value));
            this.markers.push(marker);
            console.log(marker.title);
            var markerTitle = marker.title;
            
            // Add an event listener to each marker for
            // being clicked.
            marker.addListener('click', function() {
                // For some reason, "this.title" is locked
                // to be whatever the very first click was on
                console.log('this.parent is ' + this.parentNode + '. And marker.title is ' + markerTitle);
                // For some reason if you keep clicking around,
                // this.title eventually becomes undefined. 
                // Also, when you click on a marker "this" is 
                // undefined.
                mapControl.selectPlace(this);
                mapControl.detailInfoWindow.open(map, this);  
            });
        }
    },
    
    detailInfowindow: function(selectedMarker) {
        var newInfoWindow = new google.maps.InfoWindow({
            content: selectedMarker.title
            // Flickr content will be pulled from data obj here
        })
    },
  
    // I might not need the below function depending
    // on how other stuff shakes down
    updatePlaces: function() {
        // loop through both the markers 
        // and the list and display only 
        // the one(s) matching the filter
        // which should be recorded in data
    }
};

var init = function() {
    ko.applyBindings(viewModel());
    mapControl.initMap();
};
