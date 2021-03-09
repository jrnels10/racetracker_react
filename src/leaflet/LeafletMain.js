import React, { Component } from "react";
import io from 'socket.io-client';
import * as L from "leaflet";
import Estrella from './../tracks/EstrellaMtn.json';
import { lineString, nearestPointOnLine, point } from '@turf/turf';


export const courseCompleted = (track, trackPoint) => {
  const line = lineString([...track.map(i => [i[1], i[0]])]);
  const pt = point([trackPoint[1], trackPoint[0]]);
  return nearestPointOnLine(line, pt, { units: 'miles' });
};

export default class Leafletmain extends Component {
  socket = io('http://localhost:5000');
  laps = 3;
  state = {
    lat: 33.3,
    lng: -112.09,
    zoom: 13,
    markers: {}
  };
  componentDidMount() {
    const { competitors } = this.props;
    this.mymap = L.map('mapid').setView([33.35000, -112.32000], 15);
    this.markers = L.layerGroup().addTo(this.mymap);
    this.track = [...Estrella.map(item => [item[1], item[0]])].reverse();
    L.polyline(this.track, { color: 'red' }).addTo(this.mymap);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoianJuZWxzMTAiLCJhIjoiY2ticjNwdXR4MXlpcTJ5dG1rdjF4MDdxeSJ9.tiUpLiArSzx6thNUgPOL-w'
    }).addTo(this.mymap);

    this.courseLength = (courseCompleted(this.track, this.track[this.track.length - 1]).properties.location).toFixed(2);
    this.trackers = competitors.map(user => {
      let isClicked = false
      this.markers.addLayer(user.marker);
      user.marker.on({
        mouseover: () => {
          if (!isClicked) {
            user.marker.openPopup()
          }
        },
        mouseout: function () {
          if (!isClicked) {
            user.marker.closePopup()
          }
        },
        click: function () {
          isClicked = true
          user.marker.openPopup()
        }
      });
      return user;
    });
  }

  componentDidUpdate() {
    const { competitors } = this.props;
    competitors.map(user => {
      const foundTracker = this.trackers.find(trckr => trckr.id === user.id);
      if (foundTracker) {
        foundTracker.marker.setLatLng([user.latitude, user.longitude]);
        const completed = foundTracker.getCourseCompleted(this.track, this.courseLength, this.courseLength * this.laps);
        console.log('completed', completed)
        this.racePosition();
      }
      else {
        this.trackers = [...this.trackers, user];
        this.markers.addLayer(user.marker);
      }
    });
  }

  racePosition = () => {
    this.trackers.sort((a, b) => {
      const pos = b.totalCompleted - a.totalCompleted
      if (pos < 0) {
        a.setRacePosition(true);
        b.setRacePosition(false);
        this.props.setCompetitors(this.trackers);
      }
      return pos
    });
  }

  render() {
    return (
      <div id='mapid' style={{ height: '100%' }} />
    );
  }
}

