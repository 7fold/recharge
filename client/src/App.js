import React from 'react';
import './App.css';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import * as $ from 'jquery';


$('.menu-btn').on('click', function(e) {
  e.preventDefault();
  $(this).toggleClass('menu-btn_active');
  $('.menu-nav').toggleClass('menu-nav_active');
});

function google_map () {
  function getLocation() {
    if (navigator.geolocation) {         
        navigator.geolocation.getCurrentPosition(open_map); 
    } else {
        console.log("Not allowed");
    }
}
function open_map (coordinates){
  var dd = {lat:coordinates.coords.latitude, lng: coordinates.coords.longitude};
    new window.google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new window.google.maps.LatLng(dd)
  });
}
getLocation();
}
google_map();

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);  
    this.state = { address: '', response: '' }
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res }))
      .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
 
  handleChange = (address) => {
    this.setState({ address })
  }
 
  handleSelect = (address) => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        var data = JSON.parse(this.state.response);
        // console.log(data);

        var locations = [];
        for(var i=0; i < data.length; i++){
          var smth = [data[i].LocName, data[i].Lat, data[i].Long, data[i].LocID,
                      data[i].PortsUnknown, data[i].PortsAvail, data[i].PortsInUse ,data[i].PortsWorking,
                      data[i].PortsOffline, data[i].Level3Ports, data[i].Level2Ports ,data[i].Level1Ports,
                      data[i].Network, data[i].AccessCode, data[i].LocationTag];
            locations.push(smth);
        };
        //console.log(locations);
        function initGoogleMap(){
            var bounds  = new window.google.maps.LatLngBounds();
            var image = {url: 'charger.png'};
            var infowindow = new window.google.maps.InfoWindow();
            var map = new window.google.maps.Map(document.getElementById('map'), {
              zoom: 8,
              center: new window.google.maps.LatLng(latLng),
              mapTypeControl: true,
              mapTypeControlOptions: {
                  style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                  position: window.google.maps.ControlPosition.TOP_CENTER
              },
              zoomControl: true,
              zoomControlOptions: {
                  position: window.google.maps.ControlPosition.LEFT_CENTER
              },
              scaleControl: true,
              streetViewControl: true,
              streetViewControlOptions: {
                  position: window.google.maps.ControlPosition.LEFT_TOP
              },
              fullscreenControl: true,
              fullscreenControlOptions: {
                position: window.google.maps.ControlPosition.BOTTOM_CENTER
              }
                  });
          function placeMarker(loc) {
            var latLng = new window.google.maps.LatLng( loc[1], loc[2]);
            var marker = new window.google.maps.Marker({
              position : latLng,
              map      : map,
              icon     : image,
              animation:  window.google.maps.Animation.DROP
            });
            var locat = new window.google.maps.LatLng(marker.position.lat(), marker.position.lng());
            bounds.extend(locat);
            map.fitBounds(bounds);      
            map.panToBounds(bounds); 
            window.google.maps.event.addListener(marker, 'click', function(){
                map.setZoom(10);
                map.setCenter(this.getPosition());
                infowindow.close(); // Close previously opened infowindow
                infowindow.setContent( "<div id='infowindow'>"+ loc[0] +"</div>");
                var network = "";
                if(loc[12] === 19){
                  network = "Volta";
                } else if(loc[12] === 17){
                  network = "No network";
                }else if(loc[12] === 0){
                  network = "Unknown network";
                }
                  else {
                  network = "Other";
                }
                
                // var name = loc[0];
                var info = 
                "<ul>"+
                "<li>Network: " + network + "</li>" +
                "<li>Location id: " + loc[3] + "</li>" +
                "<li>Ports available: " + loc[5] + "</li>" +
                "<li>Ports in use: " + loc[6] + "</li>" +
                "</ul>";
                // $('#name').html(name);
                $('#information').html(info);
                infowindow.open(map, marker);
            });
          }
          for(var i=0; i<locations.length; i++) {
            placeMarker( locations[i] );
          } 
        }
        initGoogleMap();
      }) 
      .catch(error => console.error('Error', error))
  }
 
  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div className="wrapper">
              <div className="container">
                  <div className="pac-card" id="pac-card">
                      <div>
                          <div id="title">
                              Charging stations nearby
                          </div>
                          {/* <div className="section">
                            <div className="menu-block">
                              <nav className="menu-nav">
                                <a href="#">Main</a>
                                <a href="#">Portfolio</a>
                                <a href="#">About</a>
                                <a href="#">Contacts</a>
                              </nav>
                              
                              <a href="" className="menu-btn">
                                <span></span>
                              </a>
                              
                            </div>
                          </div> */}
                      </div>
                    
                      <div id="pac-container">
                      <input
                              {...getInputProps({
                              placeholder: 'Enter a location',
                              id: 'pac-input',
                              type: 'text'
                              })}
                          />
                      </div>
                  </div>
                 
              </div>
              
              <div className="container">
              <div className="autocomplete-dropdown-container">
                    {suggestions.map(suggestion => {
                      const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                      // inline style for demonstration purpose
                      const style = suggestion.active
                                  ? { paddingLeft: '10px', color: 'blue', cursor: 'pointer' }
                                  : { paddingLeft: '10px', color: 'white', cursor: 'pointer' };
                      return (
                        <div {...getSuggestionItemProps(suggestion, { className, style })}>
                          <span>{suggestion.description}</span>
                        </div>
                      )
                    })}
                    </div>
                <div id="map"></div>
              </div>
              <div className="container">
                    <div id="information" ref="information"></div>
              </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default LocationSearchInput;
