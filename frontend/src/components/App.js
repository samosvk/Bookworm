import React from 'react';
import { createRoot } from "react-dom/client";
import { Link } from 'react-router-dom';
import { Button, ThemeProvider, createTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import './App.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#00ABE4',
            text: '#365486',
        },
        secondary: {
            main: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif',
        ].join(','),
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
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
