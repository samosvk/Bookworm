import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, ThemeProvider, createTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import './Home.css'
import { useTheme } from '@mui/material/styles';
import Header from './Header';

export default function Homepage() {
  return (
    <div>
        <Header />
        <div style={{marginTop:'100px'}}>
          <h1>Hi</h1>
        </div>
    </div>
  );
}


