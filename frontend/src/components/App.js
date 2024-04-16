import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Redirect,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Book from "./Book";
import Editor from "./Editor";
import Dashboard from "./Dashboard";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00ABE4",
      text: "#365486",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book/:bookId" element={<Book />} />
          <Route path="/editor/:bookId" element={<Editor />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
