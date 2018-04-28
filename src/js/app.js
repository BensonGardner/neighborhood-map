// This file was previously broken into data.js and viewModel.js, which could be done again if we can solve the asynch issue with callbacks/promises.


var data = {
    mapStart: {lat: 34.0488884, lng: -118.2404842},
    
    // Most likely I'll take all the selected values out of this array
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
            title: 'Nijiya Market',
            position: {lat: 34.0486833, lng: -118.2425657},
            feature: 'Produce, food, snacks',
            selected: false
        },
        {
            title: 'Japanese American National Museum',
            position: {lat: 34.049451, lng: -118.2409777},
            feature: 'Art, Hello Kitty Con',
            selected: false
        },
        {
            title: 'Tea Master Cafe & Tea Shop',
            position: {lat: 34.0483476, lng: -118.2413596},
            feature: 'Green tea, matcha ice cream, smoothies',
            selected: false
        }
    ]  
};

var viewModel = function() {
    
    var self = this;
    
    console.log(self);
    
    viewModel.filterWords = [];
    
    viewModel.selected = ko.observable({});

    // Called by each list item, by means of
    // data bindings in index.html
    this.selectPlace = function(listItem) {

        viewModel.selected(this);
        
        console.log(listItem.title);
        
        console.log(viewModel.selected().title);
        
        console.log(this);
        
        // Set the value of "selected" to "true" for 
        // the right data.placeData entry.
    
        // Close any open infowindow.
        
        mapControl.infowindow.close();
        
        // Open the infowindow on the marker with the matching title.
        
        for (i = 0; i < mapControl.markers.length; i++) {
            console.log(listItem.title);
            if (listItem.title == mapControl.markers[i].title) {
                console.log(mapControl.markers[i].title);
                mapControl.infowindow.open(mapControl.map, mapControl.markers[i]);
            }
        }    
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
        item.filteredIn = ko.computed(function() {
            // Break the text input into an array of separate 
            // words, case insensitive.
            viewModel.filterWords = filter().toLowerCase().split(' ');
            
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
            for (i = 0; i < viewModel.filterWords.length; i++) {
                value *= (itemInfo.indexOf(viewModel.filterWords[i]) + 1);
            };
            return value;
        });
        
        item.isSelected = ko.computed(function() {
            console.log(item.title + ' and ' + viewModel.selected().title);
            console.log(item.title == viewModel.selected().title);
            return (item.title == viewModel.selected().title);
        });
        console.log(item.title + ' is selected? ' + item.isSelected());
    });

    window.addEventListener('input', function(event) {
        mapControl.renderMarkers(viewModel.filterWords);
    });
};

var mapControl = {
    
    map: null,
    
    markers: [],

    initMap: function() {

        this.map = new google.maps.Map(document.getElementById('map'), {
                //center: data.mapStart, 
                //zoom: 13,
                styles: mapStyles,
                mapTypeControl: false
            });
        
        this.bounds = new google.maps.LatLngBounds();

        // Create image for marker icon
        this.markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|2B6D06|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34)
        );

        // Create an infowindow object, which shall
        // remain empty until a marker is clicked.
        this.infowindow =  new google.maps.InfoWindow({
            content: ''
        });

        // Create markers appearing on initialize

        this.renderMarkers([]);

    },

    selectPlace: function(marker) {
        // First remove any other selection
        // that might be in play.
        
        console.log(marker);
        
        mapControl.infowindow.close();
        
        // Stuff
        
        // Then update which place is selected and re-render markers
        
        mapControl.renderMarkers(viewModel.filterWords);

        // Then open the right infowindow
        
        mapControl.infowindow.open(mapControl.map, marker); 
        
        // Then highlight the right list item
        
        
    
    },
        
   renderMarkers: function(filterArray) {
       
       console.log(filterArray);
       console.log(viewModel);
       console.log(viewModel.filterWords);
       
       // First delete all existing markers.
       
       this.markers.forEach(function(element) {
           element.setMap(null);
       });
       
        // NOTE: Does the fact that this function is called
        // from an event Listener set up within the viewModel break
        // the rule of not having Knockout handle the Maps API?
        // If so, I could instead set an event listener outside
        // the viewModel, maybe on the whole window to listen for a 
        // keystroke.
            
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
            // as we use to filter the list in the viewModel.
            var markerInfo = (marker.title + ' ' + 
                              marker.feature).toLowerCase();
            var value = 1;
            for (j = 0; j < filterArray.length; j++) {
                value *= (markerInfo.indexOf(filterArray[j]) + 1);
            }
            
            // Set the marker to be visible only if the value
            // is true, then add it to the markers array.
            marker.setVisible(Boolean(value));
            
            this.markers.push(marker);
            let markerTitle = marker.title;
            
            // Extend the boundaries of the map for each marker and display the marker. 
            this.bounds.extend(this.markers[i].position);
            
            // Add an event listener to each marker for
            // being clicked.
            marker.addListener('click', function() {
                console.log(this);
                console.log(markerTitle);
                // First de-select all markers
                // STUFF
                // Make the selected marker bounce
               // marker.setAnimation();
                // For some reason, "this.title" is locked
                // to be whatever the very first click was on
                console.log('this.parent is ' + this.parentNode + '. And marker.title is ' + markerTitle);
                // For some reason if you keep clicking around,
                // this.title eventually becomes undefined. 
                // Also, when you click on a marker "this" is 
                // undefined.
                mapControl.selectPlace(this);
//                mapControl.detailInfoWindow.open(map, this);  
            });
        }
        this.map.fitBounds(this.bounds);
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
