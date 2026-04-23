import React from 'react';
import { Routes, Route } from "react-router-dom";

import ResourceCatalogue from './M1/pages/ResourceCatalogue';
import ResourceDetails from './M1/pages/ResourceDetails';


function App() {
  return (
    <Routes>
      <Route path="/resources" element={<ResourceCatalogue/>}/>
      <Route path="/resources/:id" element={<ResourceDetails/>}/>
    </Routes>
  );
}

export default App;