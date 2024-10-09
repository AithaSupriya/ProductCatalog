import React from 'react';
import Navbar from "./Components/Navbar";
import Signup from "./Components/Signup";
import { Routes, Route } from 'react-router-dom'; // Import Route and Routes

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Signup />} /> {/* Define route for Signup */}
        <Route path="/navbar" element={<Navbar />} /> {/* Define route for Navbar */}
      </Routes>
    </div>
  );
}

export default App;
