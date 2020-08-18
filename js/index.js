
var map;
var markers = [];
var infoWindow;
var locationSelect;



function initMap() {
    var losAngels = {
        lat: 34.063380,
        lng: -118.358080
    };
    map = new google.maps.Map(document.getElementById('map'), {
      center: losAngels,
      zoom: 11,
      mapTypeId: 'roadmap',
      styles: [
        {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
              {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
              {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{color: '#c9b2a6'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{color: '#dcd2be'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [{color: '#ae9e90'}]
              },
              {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#93817c'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{color: '#a5b076'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#447530'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#f5f1e6'}]
              },
              {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{color: '#fdfcf8'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#f8c967'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#e9bc62'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{color: '#e98d58'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [{color: '#db8555'}]
              },
              {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{color: '#806b63'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{color: '#8f7d77'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#ebe3cd'}]
              },
              {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{color: '#b9d3c2'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#92998d'}]
              }
      ]
    });

    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

function searchStores(){
    var foundStores = [];

    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
        stores.forEach(function(store, index){
            var postal = store.address.postalCode.substring(0, 5);
            if(postal == zipCode){
                foundStores.push(store);
            }
            
        })

    } else{
        foundStores = stores;
    }
    
    clearLocations();
    displayStores(foundStores);
    showStoreMarkers(foundStores);
    setOnClickListener();

}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;

  }


function setOnClickListener(){
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
        })
    })

    console.log(storeElements);
}

function displayStores(stores){
    var storeHtml = '';
    stores.forEach(function(store, index){
        var address = store.addressLines;
        var phone = store.phoneNumber;

        storeHtml +=`
            <div class="store-container">
                    <div class="store-container-background">
                        <div class="store-info-container">
                            <div class="store-address">
                             <span>${address[0]}</span>
                             <span>${address[1]}</span>
                            </div>
                            <div class="store-phone-number">${phone}
                            </div>
                        </div>
                        <div class="store-number-container">
                            <div class="store-number">${index+1}</div>
                        </div>
                    </div>
                </div>

        `

    });
    document.querySelector('.stores-list').innerHTML = storeHtml;
}


function showStoreMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();

    stores.forEach(function(store, index){
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);

        var name = store.name;
        var address = store.addressLines[0];
        var openStatusText = store.openStatusText;
        var phoneNumber = store.phoneNumber;
        createmarker(latlng, name, address, openStatusText, phoneNumber, index+1);
        bounds.extend(latlng);

    })
    map.fitBounds(bounds);
    
}


function createmarker(latlng, name, address, openStatusText, phoneNumber, index){
    var iconBase = "https://maps.google.com/mapfiles/kml/pal2/";
    var html = `
        <div class = "store-info-window">
            <div class = "store-info-name">
                ${name}
            </div>
            <div class = "store-info-status">
                ${openStatusText}
            </div>
            <div class = "store-info-address">
                <div class = "circle">
                <i class="fas fa-location-arrow"></i>
                </div>
                ${address}
            </div>
            <div class= "store-info-phone">
                <div class = "circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${phoneNumber}
            </div>
            <a href="https://www.google.com/maps/dir/Current+Location/${address}" target="_blank" class="directions-link"> 
            <div class = "store-info-phone" >
                <div class = "circle">
                    <i class="fas fa-directions"></i>
                </div>
                Get Directions. 
            </div> 
        </a >
        </div>
    `;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      icon: iconBase + "icon54.png"
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);


}