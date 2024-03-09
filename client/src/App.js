import './App.css';
import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Admin from './pages/Admin/Admin';
import Login from './pages/Login';
import Photographer from './pages/Photo_taker/Photographer';
import RoomService from './pages/Room_service/RoomService';

function App() {
  return (
    <div className="App">
      <>
      <BrowserRouter>
      <Routes>
      <Route exact path="/" element={<Login/>}/>
      <Route exact path="/admin" element={<Admin/>}/>
      <Route exact path="/photographer" element={<Photographer/>}/>
      <Route exact path="/room_service" element={<RoomService/>}/>
      </Routes>
      </BrowserRouter>
      </>
    </div>
  );
}

export default App;
