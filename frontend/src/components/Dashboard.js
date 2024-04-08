import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Grid, Card, CardActionArea, CardContent, Box, CardMedia, Typography, TextField, Paper, Snackbar } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Header from './Header';
export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [books, setBooks] = useState([]);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [change, setChange] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (accessToken) {
          const response = await axios.get('/api/dashboard/', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          });
          setUsername(response.data.username);
          setBooks(response.data.books)
          setIsSuperUser(response.data.is_superuser);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUserData();
  }, [change]);

  const handleSnackbarClose = (event, reason) => {
    setSnackbarMessage('');
    setSnackbarOpen(false);
  };

  const handleCreateBook = async () => {
    try{
      axios.post('/api/create_book/',  {title: title },
        {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      setShowForm(false);
      setSnackbarMessage('Book created successfully');
      setSnackbarOpen(true);
      setChange(change + 1);
      setTitle('');
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try{
      axios.delete(`/api/create_book/${bookId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      setSnackbarMessage('Book deleted successfully');
      setSnackbarOpen(true);
      setChange(change + 1);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const displayCreateBookForm = () => {
    if (showForm) {
      return (
        <Box style={{ display: 'flex'}}>
          <Paper>
            <TextField label="Book Title" variant="outlined" onChange={(e) => setTitle(e.target.value.trim())}/>
          </Paper>
          <Button variant="contained" color="primary" onClick={ () => {
              if (title.length !== 0 && title.length <= 100){
                handleCreateBook() 
              } else {
                setSnackbarMessage('Title must not be empty and must be less than 100 characters');
                setSnackbarOpen(true);
              }
            }}>
            Create Book
          </Button>
          <Button variant='contained' color='secondary' onClick={() => setShowForm(false)}>
            Cancel
          </Button>
      </Box>
      );
    } else {
        return (
          <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
            Create New Book
          </Button>
      );
    }
  };

  return (
    <div>
      <Header />
      <div style={{marginTop: '90px'}}>
        {isSuperUser && (
        <Box display='flex' justifyContent='center' style={{marginBottom: '20px'}}>
          {displayCreateBookForm()}
        </Box>
        )}
        <Grid container spacing={2}>
          {books.map((book, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card>
                <CardActionArea component="a" href={`/book/${book.id}`}>
                  <Box display='flex' justifyContent="center">
                    <AutoStoriesIcon style={{ fontSize: 150, color:'primary.text'}}/>
                  </Box>
                  <CardContent>
                    <Typography variant="title" component="h3" align="center">
                      {book.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              {isSuperUser && (
                <Box display='flex' justifyContent='center' marginTop='10px'>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteBook(book.id)}>
                  Delete Book
                </Button>
                </Box>
              )}
            </Grid>
          ))}
          </Grid>
      </div>
      <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={snackbarOpen}
          autoHideDuration={1000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        /> 
    </div>
  );
}
