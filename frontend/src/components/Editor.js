import React, { useState, useEffect } from "react";
import Youtube from "react-youtube";
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  Snackbar,
  CardMedia,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useParams, Link } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

function Editor() {
  const { bookId } = useParams(); //get the bookId from the URL
  const [elements, setElements] = useState([]); //store book elements in a list
  const [title, setTitle] = useState(""); //store the book title
  const [elementUpdateCount, setElementUpdateCount] = useState(0); //dummy var that tracks element update count
  const [showForm, setShowForm] = useState(false); //show form to add new element
  const [addElementType, setAddElementType] = useState("Text"); //type of element to add
  const [newElement, setNewElement] = useState({}); //store new element data to send in post request
  const [editedElement, setEditedElement] = useState({}); //store edited element data to send in put request
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    // Fetch book elements whenever bokId changes
    async function fetchElements() {
      try {
        //request book elements from the backend
        const response = await axios.get(`/api/editor/${bookId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setElements(response.data.elements);
        setTitle(response.data.book.title);
      } catch (error) {
        console.error("Error fetching elements:", error);
      }
    }

    fetchElements();
  }, [bookId, elementUpdateCount]); // rerender if elements or bookid updated. Use counter to avoid infinite loop.

  //Render textboxes based on element type
  const renderAddBoxes = () => {
    switch (addElementType) {
      case "Text":
        return (
          <div>
            <TextField
              fullWidth
              multiline
              rows={4}
              style={{ minWidth: "300px" }}
              label="Enter Text"
              onChange={(e) =>
                setNewElement({ ...newElement, text: e.target.value })
              }
            />
          </div>
        );
      case "MultipleChoice":
        return (
          <div>
            <TextField
              label="Question"
              onChange={(e) =>
                setNewElement({ ...newElement, question: e.target.value })
              }
            />
            <TextField
              label="Options (comma separated)"
              onChange={(e) =>
                setNewElement({
                  ...newElement,
                  options: e.target.value.split(",").map((item) => item.trim()),
                })
              }
            />
            <TextField
              label="Answer"
              onChange={(e) =>
                setNewElement({ ...newElement, answer: e.target.value })
              }
            />
          </div>
        );
      case "FillBlank":
        return (
          <div>
            <TextField
              label="Question"
              onChange={(e) =>
                setNewElement({ ...newElement, question: e.target.value })
              }
            />
            <TextField
              label="Answer"
              onChange={(e) =>
                setNewElement({ ...newElement, answer: e.target.value })
              }
            />
          </div>
        );
      case "Video":
        return (
          <div>
            <TextField
              label="Video URL"
              onChange={(e) =>
                setNewElement({ ...newElement, url: e.target.value })
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  const displayAddForm = () => {
    //check to show add element form
    if (showForm) {
      return (
        <div>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setShowForm(false);
              setNewElement({});
            }}
          >
            Cancel
          </Button>
          <InputLabel id="dropdown-label">Select an option</InputLabel>
          <Select
            labelId="dropdown-label"
            id="dropdown"
            value={addElementType}
            onChange={(event) => {
              setAddElementType(event.target.value);
              setNewElement({});
            }}
          >
            <MenuItem value="Text">Text</MenuItem>
            <MenuItem value="MultipleChoice">Multiple Choice</MenuItem>
            <MenuItem value="FillBlank">Fill in the Blank</MenuItem>
            <MenuItem value="Video">Video</MenuItem>
          </Select>
          {renderAddBoxes()}
        </div>
      );
    } else {
      return (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(true)}
          >
            Add Element
          </Button>
        </div>
      );
    }
  };

  //Remove associated element
  const handleRemove = async (elementId) => {
    try {
      const response = await axios.delete(
        `/api/editor/${bookId}/${elementId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setSnackbarMessage("Element deleted");
        setSnackbarOpen(true);
      }
      setElementUpdateCount(elementUpdateCount + 1);
    } catch (error) {
      console.error("Error submitting element:", error);
    }
  };

  //Add new element
  const handleAdd = async () => {
    try {
      const response = await axios.post(
        `/api/editor/${bookId}/`,
        {
          type: addElementType,
          element: newElement,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowForm(false); // hide the form after adding
      if (response.status === 201) {
        setSnackbarMessage("Element added");
        setSnackbarOpen(true);
      }
      setElementUpdateCount(elementUpdateCount + 1);
      setNewElement({}); // clear new element
    } catch (error) {
      console.error("Error submitting element:", error);
    }
  };

  //Edit the element
  const handleEdit = async (elementId) => {
    try {
      //get the edited data of the element that called the function
      const editedElementData = { ...editedElement[elementId] };
      setEditedElement((prevState) => ({
        ...prevState,
        [elementId]: {},
      }));
      const response = await axios.put(
        `/api/editor/${bookId}/${elementId}`,
        editedElementData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //if the response is successful, show a snackbar message
      if (response.status === 200) {
        setSnackbarMessage("Element updated");
        setSnackbarOpen(true);
      }
      setElementUpdateCount(elementUpdateCount + 1);
    } catch (error) {
      console.error("Error submitting element:", error);
      setSnackbarMessage("Error updating element");
      setSnackbarOpen(true);
    }
  };

  //close the snackbar
  const handleSnackbarClose = (event, reason) => {
    setSnackbarOpen(false);
  };

  const renderElementContent = (element, index) => {
    //handle the change of the edited element
    const handleEditChange = (fieldName, value) => {
      setEditedElement((prevState) => ({
        ...prevState,
        [element.id]: {
          ...prevState[element.id],
          [fieldName]: value,
        },
      }));
    };

    const handleMove = async (element, direction) => {
      try {
        const response = await axios.put(
          `/api/book/${bookId}/${element.id}`,
          {
            direction: direction,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          setSnackbarMessage("Element moved");
          setSnackbarOpen(true);
        }
        setElementUpdateCount(elementUpdateCount + 1);
      } catch (error) {
        console.error("Error moving element:", error);
        setSnackbarMessage("Error moving element");
        setSnackbarOpen(true);
      }
    };

    //common buttons for all elements
    const commonButtons = (index) => {
      return (
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleRemove(element.id)}
          >
            Remove
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(element.id)}
          >
            Update
          </Button>
          {index > 0 && (
            <Button
              variant="text"
              color="primary"
              onClick={() => handleMove(element, -1)}
            >
              <ArrowUpwardIcon fontSize="large" />
            </Button>
          )}
          {index < elements.length - 1 && (
            <Button
              variant="text"
              color="primary"
              onClick={() => handleMove(element, 1)}
            >
              <ArrowDownwardIcon fontSize="large" />
            </Button>
          )}
        </div>
      );
    };

    if (element.element_type === "MultipleChoice") {
      return (
        <div key={element.id} style={{ marginBottom: "20px" }}>
          <div>
            <TextField
              label="Question"
              variant="outlined"
              defaultValue={element.content_object.question}
              fullWidth
              multiline
              onChange={(e) => handleEditChange("question", e.target.value)}
            />
          </div>
          <div>
            <TextField
              label="Options"
              variant="outlined"
              defaultValue={element.content_object.options.join(",")}
              onChange={(e) => handleEditChange("options", e.target.value)}
            />
            <TextField
              label="Answer"
              variant="outlined"
              defaultValue={element.content_object.answer}
              onChange={(e) => handleEditChange("answer", e.target.value)}
            />
          </div>
          {commonButtons(index)}
        </div>
      );
    } else if (element.element_type === "Text") {
      return (
        <div key={element.id} style={{ marginBottom: "20px" }}>
          <TextField
            label="Text"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            defaultValue={element.content_object.text}
            onChange={(e) => handleEditChange("text", e.target.value)}
          />
          {commonButtons(index)}
        </div>
      );
    } else if (element.element_type === "FillBlank") {
      return (
        <div key={element.id} style={{ marginBottom: "20px" }}>
          <TextField
            label="Question"
            variant="outlined"
            defaultValue={element.content_object.question}
            fullWidth
            multiline
            onChange={(e) => handleEditChange("question", e.target.value)}
          />
          <TextField
            label="Answer"
            variant="outlined"
            defaultValue={element.content_object.answer}
            onChange={(e) => handleEditChange("answer", e.target.value)}
          />
          {commonButtons(index)}
        </div>
      );
    } else if (element.element_type === "Video") {
      return (
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              marginBottom: "5px",
              paddingLeft: "100px",
              paddingRight: "100px",
            }}
          >
            <CardMedia
              component="iframe"
              src={element.content_object.url}
              sx={{
                aspectRatio: "16/9",
              }}
            />
          </div>
          <div>
            <TextField
              label="Video URL"
              variant="outlined"
              defaultValue={element.content_object.url}
              fullWidth
              onChange={(e) => handleEditChange("url", e.target.value)}
            />
          </div>
          {commonButtons(index)}
        </div>
      );
    } else {
      return null; // Handle other types if needed
    }
  };

  return (
    <div>
      <Header />
      <Container maxWidth="lg" style={{ paddingTop: "60px" }}>
        <Paper elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
          <Typography
            variant="h4"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {title}
          </Typography>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link to={`/book/${bookId}`}>
              <Button>View Book</Button>
            </Link>
          </div>
          <div style={{ paddingRight: "20px", paddingLeft: "20px" }}>
            {elements.map(
              (
                element,
                index // Render each element
              ) => renderElementContent(element, index)
            )}
          </div>
          <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            {displayAddForm()}
          </div>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={snackbarOpen}
          autoHideDuration={800}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Container>
    </div>
  );
}

export default Editor;
