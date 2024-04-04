import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ThemeProvider, createTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import './Home.css'
import { useTheme } from '@mui/material/styles';

export default function Homepage() {
  return (
      <div className="App">
        <header className="App-header">
          <div className='container'>
          <div className='title'>
            <Typography variant="h1" component="h1" gutterBottom color='primary.text'>
              Bookworm
            </Typography>
          <div className="registerButton">
            <Link to="/register">
              <Button variant='contained' color='secondary'>Create Account</Button>
            </Link>
          </div>
          </div>
          <div className="loginButton">
            <Link to="/login">
              <Button variant='contained' color='primary'>Sign In</Button>
            </Link>
          </div>
          </div>
          <h1>Welcome to My Homepage</h1>
        </header>
      </div>
  );
}


