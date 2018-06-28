var data = {
    
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
};

var viewModel = function() {
    
    var self = this;
    
    this.filterWords = [];
    
    self.selectedInd = ko.observable(null);
    
    // Called by each list item, by means of
    // data bindings in index.html
    self.selectPlace = function(info, event, l) {
        console.log(l + " and " + l());
        if (selectedInd() == l()) {
            selectedInd(null);
        } else {
            selectedInd(l());
            listArray().forEach(function(item) {
                console.log(item.isSelected());
            });
        };
        // We are passing the index value 
        // from the listArray. Using this 
        // l value (i), we can select
        // the correct place from the listArray
        // and the mapControl, also highlighting 
        // the correct list item.
        mapControl.renderMap(filterWords); 
        mapControl.map.panToBounds(mapControl.bounds);
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
        // Compute whether each item is selected
        // based on whether the selected Index is the 
        // correct index.
        item.isSelected = ko.computed(function() {
            return (listArray.indexOf(item) == selectedInd()); 
        });
        
        console.log(item.isSelected());
        // Determine whether each item should be filtered in
        // (i.e. displayed in the list) by using a ko.computed 
        // observable.
        item.filteredIn = ko.computed(function() {
            // Break the text input into an array of separate 
            // words, case insensitive.
            filterWords = filter().toLowerCase().split(' ');
            
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
            for (i = 0; i < filterWords.length; i++) {
                value *= (itemInfo.indexOf(filterWords[i]) + 1);
            };
            return value;
        });       
    });
    
    $(window).on('input', function() {
        mapControl.renderMap(filterWords);
    });
}

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

        // Create an infowindow object, 
        // empty until a marker is clicked.
        this.infowindow = new google.maps.InfoWindow({
            content: '<div id="infowindow"><h2>Unable to load photos at this time.</h2></div>'
        });
        
        // De-select place if user closes infowindow. 
        this.infowindow.addListener('closeclick', function() {
            selectedInd(null);
            mapControl.renderMap(filterWords);
        });

        // Create markers appearing on initialize
        for (place = 0; place < data.placeData.length; place++) {
            var marker = new google.maps.Marker({
                position: data.placeData[place].position,
                map: this.map,
                title: data.placeData[place].title,
                feature: data.placeData[place].feature,
                icon: this.markerImage,
                animation: null,
            });
            this.markers.push(marker);
            let thePlace = place;
            marker.addListener('click', function() {            
                if (selectedInd() == thePlace) {
                    // De-select the clicked marker if it was 
                    // already in selected state.
                    selectedInd(null);
                } else {
                    // Otherwise, select the clicked marker.
                    selectedInd(thePlace);   
                };
                mapControl.renderMap(filterWords); 
            });
        };

        // Render map feeding it an empty array
        // to reperesent the empty search filter
        // on load
        this.renderMap([]);
        mapControl.map.fitBounds(mapControl.bounds);

    },

    renderMap: function(filterArray) {
       
       console.log(this.bounds); // works...
       
        // NOTE: Does the fact that this function is called
        // from an event Listener set up within the viewModel break
        // the rule of not having Knockout handle the Maps API?
        // If so, I could instead set an event listener outside
        // the viewModel, maybe on the whole window to listen for a 
        // keystroke.
            
        for (i = 0; i < mapControl.markers.length; i++) {
            console.log(filterArray);
            let marker = mapControl.markers[i];
            console.log(marker.title);
            
            // We'll use a similar technique to filter the markers
            // as we use to filter the list in the viewModel.
            var markerInfo = (marker.title + ' ' + 
                              marker.feature).toLowerCase();
            console.log(markerInfo);
            var value = 1;
            for (j = 0; j < filterArray.length; j++) {
                value *= (markerInfo.indexOf(filterArray[j]) + 1);
            };
            
            // Set the marker to be visible only if the value
            // is true, then add it to the markers array.
            // The getVisible method is to make sure 
            // asynch calls in the Maps API don't cancel
            // each other out.
            
            console.log(marker.getVisible());
            console.log(Boolean(value));
            console.log(marker.getVisible() != Boolean(value));
            if (marker.getVisible() != Boolean(value)) {
                marker.setVisible(Boolean(value));
            };
                
            let markerTitle = marker.title;
            
            // Extend the boundaries of the map for each marker
            // if no marker is selected, or else the selected 
            // marker only. 

            if(selectedInd() == null) {
                mapControl.infowindow.close();
                mapControl.bounds.extend(marker.position);
            };

            if (selectedInd() == i) {
                // We don't want the marker to be selected if
                // it's not filtered in.
                if (!value) {
                    selectedInd(null);
                    return;
                };
                
                if (marker.getAnimation() == null) {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }; 
                
                mapControl.infowindow.setContent('<div id="infowindow"><h2>Recent photos from Flickr</h2><div id="photos"></div></div>');
                mapControl.infowindow.open(this.map, marker); 
                mapControl.bounds.extend(marker.position);
                mapControl.map.panToBounds(mapControl.bounds);
            };

            if (selectedInd() == null || selectedInd() !== i ) {
                marker.setAnimation(null);               
            };
    
        };
       
        if (selectedInd() !== null) {
            console.log(selectedInd())
            for (n = 0; n < 4; n++) {
                let imgsrc = listArray()[selectedInd()].photos()[n];
                if (listArray()[selectedInd()].photos()[n]) {
                    let imgsrc = listArray()[selectedInd()].photos()[n];
                };
                if (imgsrc == 'fail') {
                    $('#photos').append('<p>Unable to load Flickr photos right now. Please try again.</p>');
                } else if (imgsrc) {
                    $('#photos').append('<img src="' + imgsrc + '">');
                } else if (n == 0) {
                    $('#photos').append('<p>No Flickr photos available right now.</p>');
                };

                if (listArray()[selectedInd()].photos().length > 4) {
                    // add right and left arrows
                    // on the right arrow, put an event listener
                    // which will pop out initial elements of 
                    // the photos array and then stick them back on the 
                    // end. 
                    // on the left arrow, a listener which will 
                    // pop out the last 4 elements of 
                    // the array and put them back at the beginning.
                };
            };
        };
    },
    
}

var init = function() {
    // To initiate app, first initiate the viewModel and the map.
    ko.applyBindings(viewModel());
    mapControl.initMap();
    
    // Finally, load Flickr data for each of the locations
    // and push an array of photos into the viewModel.
    // Width is the Flickr API default, or 
        
    var bbox = mapControl.bounds.b.b + ',' + mapControl.bounds.f.b +
        ',' + mapControl.bounds.b.f + ',' + mapControl.bounds.f.f;

    var flickrURL,
        placeText;

    for (let i = 0; i < data.placeData.length; i++) {
        placeText = data.placeData[i].title;
        flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ef3f7d59d4fd1ccbc829daa5d04ac6a7&format=json&nojsoncallback=1&text=' 
        + encodeURI(placeText) 
        + '&bbox=' + bbox;
        console.log(flickrURL);
        data.placeData[i].flickr = flickrURL;
        listArray()[i].photos = ko.observableArray();
        let settings = {
            async: true,
            url: flickrURL,
            error: function(jqxhr, status, exception) {
                console.log('Exception:', exception);
            }
        };
        console.log(settings);
        $.ajax(settings).done(function(responseData){
            if (responseData.stat == 'fail') {
                listArray()[i].photos.push('fail');
                return;
            };
            data.flickr = 'success';
            console.log(responseData);
            responseData.photos.photo.forEach(function(pic) {
                listArray()[i].photos.push('https://farm' + pic.farm + '.staticflickr.com/' + pic.server + '/' + pic.id + '_' + pic.secret + '_m.jpg');
            })
        });
        console.log(listArray()[i].photos());
    };
}
