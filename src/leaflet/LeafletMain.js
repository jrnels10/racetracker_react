import React, { Component } from "react";
import io from 'socket.io-client';
import * as L from "leaflet";
import Estrella from './../tracks/EstrellaMtn.json';
import axios from 'axios';


class Tracker {
  constructor(location, user) {
    this.latLing = [location.latitude, location.longitude];
    this.username = user.username;
    this.marker = new L.Marker(this.latLing, {
      rotationAngle: 100
    }).bindPopup(`<label>${this.username}</label>`);
  }
}

export default class Leafletmain extends Component {
  state = {
    lat: 33.3,
    lng: -112.09,
    zoom: 13,
  };

  componentDidMount() {
    const mymap = L.map('mapid').setView([33.3, -112.09], 10);
    const socket = io('http://localhost:5000');
    const markers = L.layerGroup().addTo(mymap);
    const track = [...Estrella.map(item => [item[1], item[0]])];
    var polyline = L.polyline(track, { color: 'red' }).addTo(mymap);
    // mymap.fitBounds(polyline.getBounds());
    socket.on('connect', function (data) {
      console.log(data)
    });
    socket.on('marker', function (data) {
      markers.clearLayers();
      console.log(data)

      data.map(position => {
        let isClicked = false
        const tracker = new Tracker(position[0], position[1]);

        tracker.marker.on({
          mouseover: () => {
            if (!isClicked) {
              tracker.marker.openPopup()
            }
          },
          mouseout: function () {
            if (!isClicked) {
              tracker.marker.closePopup()
            }
          },
          click: function () {
            isClicked = true
            tracker.marker.openPopup()
          }
        })
        return markers.addLayer(tracker.marker)
      });
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoianJuZWxzMTAiLCJhIjoiY2ticjNwdXR4MXlpcTJ5dG1rdjF4MDdxeSJ9.tiUpLiArSzx6thNUgPOL-w'
    }).addTo(mymap);
    mymap.on("click", async function (e) {
      markers.clearLayers();
      const position = [e.latlng.lat, e.latlng.lng]
      markers.addLayer(new L.Marker([e.latlng.lat, e.latlng.lng]));
      return await axios.post(`http://192.168.0.45:5000/auth/signup`, { username: 'jacob23', email: 'jrnel15@gmail.com', password: 'Cocobean123!' })
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
        .catch(error => console.log(error.response))
      socket.emit('marker', position);
    });
  }

  render() {
    return (
      <div id='mapid' style={{ height: '100%' }} />
    );
  }
}
