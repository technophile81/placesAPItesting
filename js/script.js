var map;
var infowindow;
var searchwords = "happy+hour";

// Initiate Map
function initMap() {
    var austin = {lat: 30.2672, lng: -97.7431};

    map = new google.maps.Map(document.getElementById('map'), {
        center: austin,
        zoom: 13
        /*styles: [{
            stylers: [{ visibility: 'simplified' }]
        }, {
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }] */
    });

    infowindow = new google.maps.InfoWindow();

    var populationOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.1,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.075,
        map: map,
        center: austin,
        radius: 7000
    };
    // Add the circle for this city to the map.
    cityCircle = new google.maps.Circle(populationOptions);

    var service = new google.maps.places.PlacesService(map);
    service.radarSearch({
        location: austin,
        radius: 7000,
        keyword: searchwords
    }, callback);
}

var bars = [];

function callback(results, status) {
    console.log(results.length);
    console.log(results);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {

            //Using setTimeout and closure because limit of 10 queries /second for getDetails */
            (function (j) {
                var request = {
                    placeId: results[i]['place_id']
                };

                service = new google.maps.places.PlacesService(map);
                setTimeout(function() {
                    service.getDetails(request, callback);
                }, j*1000);


            })(i);

            function callback(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    createMarker(place);
                    console.log(place.name +  results.length + bars.length);
                    bars.push([place.name, place.website, place.rating]);

                    if(results.length == bars.length){
                        console.log(bars);
                        var request = new XMLHttpRequest();
                        request.open('POST', 'http://localhost/agency-map/src/save.php', true);
                        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                        request.send(JSON.stringify(bars));
                    }
                }
            }
        }
    }
}

/*function createMarker(place) {
    var photos = place.photos;
    if (!photos) {
        return;
    }
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        icon: photos[0].getUrl({'maxWidth': 50, 'maxHeight': 50})
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name + " : " + place.website);
        infowindow.open(map, this);
    });
}*/

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }