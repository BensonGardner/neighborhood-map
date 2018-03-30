
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
        {title: '', 
         position: {lat: 0, lng: 0}
        },
        {}
    ],
    
    filter: '',
    
    

    
}
