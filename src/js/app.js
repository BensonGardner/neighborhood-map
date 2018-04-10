// This file was previously broken into data.js and viewModel.js, which could be donee again if we can solve the asynch issue with callbacks/promises.

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

    /* I believe the below function will go away,
       to be replaced by stuff in the subscribe
       method farther below.
       
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
    
    this.createMarkers = function() {
        for (i = 0; i < data.placeData.length; i++) {
            var marker = new google.maps.Marker({
                position: data.placeData[i].position,
                map: this.map,
                styles: mapStyles,
                title: data.placeData[i].title,
                filter: data.placeData[i].filter
            });
            this.markers.push(marker);
        };
    };
    
    this.selectPlace = function() {
        console.log('selected! ' + this.title);
        
        // Needs to be called by either a
        // list item or a marker
        
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
    
    this.listArray = ko.observableArray(JSON.parse(JSON.stringify(data.placeData)));

    this.filteredIn = ko.pureComputed(function(){
        console.log(this);
        return (this.listArray().title.indexOf(filter) + 1);
    }, this);
    
    /* COMMENTING THIS OUT FOR NOW --
       I am trying to use the filteredList 
       approach instead. When I tried this, 
       I got the message that "display"
       was not defined when I referenced it in the data
       binding in index.html.
       
    // The computed function in this loop
    // gets attached to the placeData array to 
    // keep track of whether one of the list items' 
    // title or feature properties contains the 
    // text entered in the filter. 
    for (i = 0; i < this.listArray.length; i++) {

        var text = this.listArray[i].title + ' ' + 
            this.listArray[i].feature;
        
        this.listArray[i].display = ko.computed(function() {
            if (filter() == '') {
                return 'block';
            }
            if (text.indexOf(filter()) == -1) {
                return 'none';
            } else {
                return 'block';
            };
        });
        
        console.log('display() for ' + this.listArray[i].title + ' is ' + this.listArray[i].display());
    
    };
    
    */
    
    // This line creates a copy of the placeData array 
    // from our data model. We need to use the JSON methods
    // in order to grab the exact same content but ensuring
    // it's a copy, instead of the exact same object. 
    // If it were the latter, our Knockout methods would
    // alter our original data. 
    
/*    this.filteredList = ko.computed(function() {
    
        if (filter = '') {
            return listArray;
        } else {       
            listArray().filter(function() {
                this.listArray.remove(function (item) { 
                    return ((item.title + item.feature).indexOf(this.filter) != -1); 
                }) 
            })
        };  
    });*/
                                    
    
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
        console.log(listArray().length + '. ');
        
        //placesArray = JSON.parse(JSON.stringify(data.placeData));
        //listArray(JSON.parse(JSON.stringify(data.placeData)));
        
        console.log(listArray().length + '. ' + data.placeData.length);
        
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
            var currentPlaceItem = listArray()[i],
                currentMarker = markers[i],
                currentPlace = data.placeData[i];
            console.log((currentPlace.title + currentPlace.feature).indexOf(filter()));
            if ((currentPlace.title + currentPlace.feature).indexOf(filter()) == -1) {
                console.log((currentPlace.title + currentPlace.feature).indexOf(filter()));
                console.log("removing " + currentPlaceItem.title);
                listArray.remove(currentPlaceItem);
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
        
};

initMap = function() {
        
    console.log(this + " is this");
    
    this.map = new google.maps.Map(document.getElementById('map'), {
            center: data.mapStart, 
            zoom: 13,
            styles: mapStyles,
            mapTypeControl: false
        });
      
        // Create markers appearing on initialize
        
    this.createMarkers();
        
        // Add an infoWindow to each marker either inside the above loop or in a separate loop.
        
        // Code to come
        
        // Create a single infowindow that appears on clicking marker
        /* var infoWindow = new google.maps.InfoWindow({
             content: 'This is the perfect place for spying on Solar NY'
         });

         // Event listener for clicking on marker
         marker.addListener('click', function() {
             infoWindow.open(map, marker);
         });*/

     };
    
    // I might not need the below function depending
    // on how other stuff shakes down
    this.updatePlaces = function() {
        // loop through both the markers 
        // and the list and display only 
        // the one(s) matching the filter
        // which should be recorded in data/
        
};

ko.applyBindings(viewModel());

/* Need to figure out why this wasn't working:

Promise.all([data, knockout]).then(function() {
    ko.applyBindings(viewModel);
}, function() {
    document.getElementById('list').append('Failed to load required files. Please try refreshing the page.');
});
*/
