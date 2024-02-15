import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ThemeProvider, createTheme } from '@mui/material';

const defaultTheme = createTheme();

const styles = {
  buttonContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
};

export default function Homepage() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to My Homepage</h1>
          <p>This is a blank homepage with a login button.</p>
          <div style={styles.buttonContainer}>
            <Link to="/login">
              <Button variant='contained'>Login</Button>
            </Link>
          </div>
        </header>
      </div>
    </ThemeProvider>
  );
}


