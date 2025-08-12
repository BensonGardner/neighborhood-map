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
        if (selectedInd() == l()) {
            selectedInd(null);
        } else {
            selectedInd(l());
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
        
        console.log(document.getElementsByClassName('gm-err-content'));

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
       
        // NOTE: Does the fact that this function is called
        // from an event Listener set up within the viewModel break
        // the rule of not having Knockout handle the Maps API?
        // If so, I could instead set an event listener outside
        // the viewModel, maybe on the whole window to listen for a 
        // keystroke.
            
        for (i = 0; i < mapControl.markers.length; i++) {
            let marker = mapControl.markers[i];
            
            // We'll use a similar technique to filter the markers
            // as we use to filter the list in the viewModel.
            var markerInfo = (marker.title + ' ' + 
                              marker.feature).toLowerCase();
            var value = 1;
            for (j = 0; j < filterArray.length; j++) {
                value *= (markerInfo.indexOf(filterArray[j]) + 1);
            };
            
            // Set the marker to be visible only if the value
            // is true, then add it to the markers array.
            // The getVisible method is to make sure 
            // asynch calls in the Maps API don't cancel
            // each other out.

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
    // Width is at Flickr's default, as it's close to what
    // we need.
        
    var bbox = mapControl.bounds.b.b + ',' + mapControl.bounds.f.b +
        ',' + mapControl.bounds.b.f + ',' + mapControl.bounds.f.f;

    var flickrURL,
        placeText;

    for (let i = 0; i < data.placeData.length; i++) {
        placeText = data.placeData[i].title;
        flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ef3f7d59d4fd1ccbc829daa5d04ac6a7&format=json&nojsoncallback=1&text=' 
        + encodeURI(placeText) 
        + '&bbox=' + bbox;
        data.placeData[i].flickr = flickrURL;
        listArray()[i].photos = ko.observableArray();
        let settings = {
            async: true,
            url: flickrURL,
            error: function(jqxhr, status, exception) {
                console.log('Exception:', exception);
            }
        };

        /* If there is a problem with the load, we'll 
           record that in the viewModel's listArray...
           so that we can give users an error message 
           that informs them of what the issue is. 
           Otherwise, we'll push the photos into the array.
           If Flickr has no matching photos right now,
           we'll let users know that as well. */
        
        $.ajax(settings).done(function(responseData){
            if (responseData.stat == 'fail') {
                listArray()[i].photos.push('fail');
                return;
            };
            responseData.photos.photo.forEach(function(pic) {
                listArray()[i].photos.push('https://farm' + pic.farm + '.staticflickr.com/' + pic.server + '/' + pic.id + '_' + pic.secret + '_m.jpg');
            })
        });
    };
};

// The errorMsg function kicks in if the Google Maps API
// doesn't load properly.
var googleErrorMsg = function() {
    var msg = document.createTextNode('Sorry about this, but there\'s a problem loading the map. Please try again.');
    var node = document.createElement('p');
    node.appendChild(msg);
    node.className = 'warning';
    document.getElementById('map').appendChild(node);
};
