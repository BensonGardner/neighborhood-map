// This file was previously broken into data.js and viewModel.js, which could be done again if we can solve the asynch issue with callbacks/promises.


var data = {
    
    // Most likely I'll take all the selected values out of this array
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
            title: 'Nijiya Market',
            position: {lat: 34.0486833, lng: -118.2425657},
            feature: 'Produce, food, snacks'
            
        },
        {
            title: 'Japanese American National Museum',
            position: {lat: 34.049451, lng: -118.2409777},
            feature: 'Art, Hello Kitty Con'
            
        },
        {
            title: 'Tea Master Cafe & Tea Shop',
            position: {lat: 34.0483476, lng: -118.2413596},
            feature: 'Green tea, matcha ice cream, smoothies'
            
        },
        {
            title: 'James Irvine Japanese Garden',
            position: {lat: 34.047643, lng: -118.2436656},
            feature: '"Garden of the Clear Stream"'
            
        }
    ],
    
    // This function loads Flickr photos for each of the locations. 
    getFlickr: function() {
        
        var bbox = mapControl.bounds.b.b + ',' + mapControl.bounds.f.b +
            ', ' + mapControl.bounds.b.f + ', ' + mapControl.bounds.f.f;

        for (i = 0; i < data.placeData.length; i++) {
            var placeText = data.placeData[i].title;
            var flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ef3f7d59d4fd1ccbc829daa5d04ac6a7&format=json&text=' + placeText + '&bbox=' + bbox;    
            data.placeData[i].flickr = $.getJSON(flickrURL)
                .fail(function(){
                    data.placeData.flickr = {title: 'Unable to load photos.'};
                });
        };
    
    }
};

var viewModel = function() {
    
    var self = this;
    
    console.log(self);
    
    viewModel.filterWords = [];
    
    viewModel.highlight = function(k) {
        console.log(k); // i'm stillc alling teh function with an object. need to change that i order to test
        
        console.log(window.listArray()[k]);
        
        viewModel().listArray()[k].isSelected = true;
        
        // Shouldn't need this
        // viewModel.selected(this);
        
        // There might be a way to refactor this next bit
        // so that when we render markers we are always
        // passing an array of index values which will 
        // correspond to particular markers that will 
        // then be fit within the view.
        // Make sure the selected place is within the 
        // map's visible bounds
        if (!mapControl.map.getBounds().contains(this.position)) {
            mapControl.bounds.extend(this.position);
            mapControl.map.panToBounds(mapControl.bounds);
        };
        
        /* Shouldn't need this
        for (i = 0; i < mapControl.markers.length; i++) {
            console.log(listItem.title);
            if (listItem.title === mapControl.markers[i].title) {
                console.log(mapControl.markers[i].title);
            }
        }   */
    }
    
    // shouldn't need this
    // viewModel.selected = ko.observable({});
    
    // Called by each list item, by means of
    // data bindings in index.html
    self.selectPlace = function(l) {
        // We are passing the index value 
        // from the listArray. Using this 
        // l value (i), we can select
        // the correct place from the listArray
        // and the mapControl, also highlighting 
        // the correct list item. 
        viewModel.highlight(l);
        mapControl.selectPlace(l);
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
        
        // To begin with, no item is selected.
        item.isSelected = false;
        
        

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

    window.addEventListener('input', function(event) {
        mapControl.renderMarkers(viewModel.filterWords);
    });
    });
};

var mapControl = {
    
    map: null,
    
    markers: [],

    initMap: function() {

        this.map = new google.maps.Map(document.getElementById('map'), {
                // We don't need "center" or "zoom" values 
                // because we'll fit the bounds to the markers.
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
        this.infowindow = new google.maps.InfoWindow({
            content: ''
        });

        // Create markers appearing on initialize

        this.renderMarkers([]);

    },

    selectPlace: function(l) {
        
        console.log(l);
        
        // First remove any other selection
        // that might be in play.        
        mapControl.infowindow.close();
        
        // Why would we need to render the markers at this moment?
        // Then update which place is selected and re-render markers
        // viewModel.selected(this); // "this" might be wrong choice
        // mapControl.renderMarkers(viewModel.filterWords);
        console.log(mapControl.markers[l]);
        console.log(mapControl.markers);
        // Make the selected marker bounce
        mapControl.toggleBounce(mapControl.markers[l]);
        
        // Then open the right infowindow
        mapControl.infowindow.open(mapControl.map, mapControl.markers[l]); 
        
        // For some weird reason I'm getting error messasges
        // that viewModel.selectPlace is not a function (!).
        // According to my console, it IS a function. The following
        // two statements log teh viewModel correctly, and an 
        // 'undefined' message, respectively.
        // THIS DIDN'T HAPPEN until after I changed some other stuff
        // The most recent was changin g"i" to "l" in the
        // mapControl selectPlace function -- but maybe that's 
        // just bceuse I as getting hung up on that issue and never
        // seeing the next pieces.
        console.log(viewModel);
        console.log(viewModel());
        
        selectPlace(l);
        
        // Then highlight the right list item
        // STUFF
    },
    
    toggleBounce: function(marker) {
        mapControl.markers.forEach(function(mrkr){
            mrkr.setAnimation(null);
        });
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        console.log(marker.getAnimation());
      },
        
   renderMarkers: function(filterArray) {
       
       console.log(this.bounds); // works...
       
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
                icon: this.markerImage,
                animation: null,
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

            
            // REplace with a function where you pass an a
            // array of relevant marekrs (the selected one or else
            // all of them) and it extends bounds accordingly
            
            // Extend the boundaries of the map for each marker
            // if no marker is selected, or else the selected 
            // marker only. 
            
                this.bounds.extend(marker.position); 
            
            /*if (viewModel.listArray[i].isSelected().title || viewModel.selected().title == markerTitle) {
                console.log('ho yah gonna extend the bounds');
                this.bounds.extend(marker.position); 
            };  */
            
            console.log(i);
            
            let m = i;
            // Add an event listener to each marker for
            // being clicked.
            marker.addListener('click', function() {
                console.log(this);
                console.log(markerTitle);
                // First de-select all markers
                // STUFF
                console.log(m); 
                mapControl.selectPlace(m); 
                viewModel.highlight(m);
            });
        }
        console.log(this.map); // works
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
    data.getFlickr();
};
