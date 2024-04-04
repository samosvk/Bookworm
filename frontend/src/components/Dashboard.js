import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, ThemeProvider, createTheme } from '@mui/material';
import Header from './Header';
export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const response = await axios.get('/api/dashboard/', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          });
          setUsername(response.data.username);
          setBooks(response.data.books)
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      {username ? (
        <div>
          <Header />
          <div>
            <h1>Welcome, {username}!</h1>
            <div>
              {/* Map through books array and render a button for each */}
              {books.map((book, index) => (
                <Link to = {`/book/${book.id}`}>
                    <Button variant='contained' key={index}>{book.title} </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <h1>Forbidden, please log in</h1>
      )}
    </div>
  );
}
