import React from 'react';
import Leafletmain from './leaflet/LeafletMain';
import MainEvent, { MainEventContainer } from './Pages/MainEvent';
import './App.css'
function App() {
  return (
    <div className="App">
      {/* <Leafletmain /> */}
      {/* <MainEvent /> */}
      <MainEventContainer />
    </div>
  );
}

export default App;
