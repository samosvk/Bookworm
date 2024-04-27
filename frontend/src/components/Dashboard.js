import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  CardMedia,
  Typography,
  TextField,
  Paper,
  Snackbar,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Header from "./Header";
export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(-1); //set the element to show form for and <0 to hide
  const [addTitle, setAddTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [change, setChange] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (accessToken) {
          const response = await axios.get("/api/dashboard/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setBooks(response.data.books);
          setIsSuperUser(response.data.is_superuser);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUserData();
  }, [change]);

  const handleSnackbarClose = (event, reason) => {
    setSnackbarMessage("");
    setSnackbarOpen(false);
  };

  const handleCreateBook = async () => {
    try {
      axios.post(
        "/api/create_book/",
        { title: addTitle },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowAddForm(false);
      setSnackbarMessage("Book created successfully");
      setSnackbarOpen(true);
      setChange(change + 1);
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  const handleEditBook = async (bookId) => {
    try {
      axios.put(
        `/api/create_book/${bookId}/`,
        { title: editTitle },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowEditForm(-1);
      setSnackbarMessage("Book edited successfully");
      setSnackbarOpen(true);
      setChange(change + 1);
    } catch (error) {
      console.error("Error editing book:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      axios.delete(`/api/create_book/${bookId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSnackbarMessage("Book deleted successfully");
      setSnackbarOpen(true);
      setChange(change + 1);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const displayEditBookForm = (bookId) => {
    if (showEditForm == bookId) {
      return (
        <Box style={{ display: "flex" }}>
          <Paper>
            <TextField
              label="Book Title"
              variant="outlined"
              onChange={(e) => setEditTitle(e.target.value.trim())}
            />
          </Paper>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (editTitle.length !== 0 && editTitle.length <= 100) {
                handleEditBook(bookId);
              } else {
                setSnackbarMessage(
                  "Title must not be empty and must be less than 100 characters"
                );
                setSnackbarOpen(true);
              }
            }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowEditForm(-1)}
          >
            Cancel
          </Button>
        </Box>
      );
    } else {
      return (
        //on click show form and reset old title
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowEditForm(bookId);
              setEditTitle("");
            }}
          >
            Edit Title
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteBook(bookId)}
          >
            Delete Book
          </Button>
        </div>
      );
    }
  };

  const displayCreateBookForm = () => {
    if (showAddForm) {
      return (
        <Box style={{ display: "flex" }}>
          <Paper>
            <TextField
              label="Book Title"
              variant="outlined"
              onChange={(e) => setAddTitle(e.target.value.trim())}
            />
          </Paper>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (addTitle.length !== 0 && addTitle.length <= 100) {
                handleCreateBook();
              } else {
                setSnackbarMessage(
                  "Title must not be empty and must be less than 100 characters"
                );
                setSnackbarOpen(true);
              }
            }}
          >
            Create Book
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </Button>
        </Box>
      );
    } else {
      return (
        //on click show form and reset old title
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setShowAddForm(true);
            setAddTitle("");
          }}
        >
          Create New Book
        </Button>
      );
    }
  };

  return (
    <div>
      <Header />
      <div style={{ marginTop: "90px" }}>
        {isSuperUser && (
          <Box
            display="flex"
            justifyContent="center"
            style={{ marginBottom: "20px" }}
          >
            {displayCreateBookForm()}
          </Box>
        )}
        <Grid container spacing={2} paddingLeft={10} paddingRight={10}>
          {books.map((book, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card>
                <CardActionArea component="a" href={`/book/${book.id}`}>
                  <Box display="flex" justifyContent="center">
                    <AutoStoriesIcon
                      style={{ fontSize: 150, color: "primary.text" }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="title" component="h3" align="center">
                      {book.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              {isSuperUser && (
                <Box display="flex" justifyContent="center" marginTop="10px">
                  {displayEditBookForm(book.id)}
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
}
