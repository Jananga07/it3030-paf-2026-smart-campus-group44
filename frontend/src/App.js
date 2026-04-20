import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from './Home/Home';
import Navbar from './M2/components/Navbar'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path='/nav' element={<Navbar/>}/>
    </Routes>
  );
}

export default App;