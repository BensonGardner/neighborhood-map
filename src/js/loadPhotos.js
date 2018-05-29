// This function loads Flickr photos for each of the locations.
/*
 (function() {
    var bbox = mapControl.bounds.b.b + ',' + mapControl.bounds.f.b +
        ', ' + mapControl.bounds.b.f + ', ' + mapControl.bounds.f.f;
    for (i = 0; i < data.placeData.length; i++) {
        var placeText = data.placeData[i].title;
        var flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ef3f7d59d4fd1ccbc829daa5d04ac6a7&format=json&text=' + placeText + '&bbox=' + bbox;    
        data.placeData[i].flickr = $.getJSON(flickrURL)
            .fail(function(){
                data.placeData.flickrJSON = {title: 'Unable to load photos.'};
            });
    };
})();
*/