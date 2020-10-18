import React, { Component } from "react";
import io from 'socket.io-client';
import * as L from "leaflet";

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
    socket.on('connect', function (data) {
      console.log(data)
    });
    socket.on('marker', function (data) {
      markers.clearLayers();
      console.log(data)
      data.map(position => markers.addLayer(new L.Marker(position)));
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoianJuZWxzMTAiLCJhIjoiY2ticjNwdXR4MXlpcTJ5dG1rdjF4MDdxeSJ9.tiUpLiArSzx6thNUgPOL-w'
    }).addTo(mymap);
    mymap.on("click", function (e) {
      markers.clearLayers();
      const position = [e.latlng.lat, e.latlng.lng]
      markers.addLayer(new L.Marker([e.latlng.lat, e.latlng.lng]));

      socket.emit('marker', position);
    });
  }
  render() {
    return (
      <div id='mapid' style={{ height: '100%' }} />
    );
  }
}
