import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,  // Instead of Switch
} from "react-router-dom";
import Login from './Login';
import Register from './Register';
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path ="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/home" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
