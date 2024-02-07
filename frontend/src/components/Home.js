import React from 'react';
import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Homepage</h1>
        <p>This is a blank homepage with a login button.</p>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </header>
    </div>
  );
}

