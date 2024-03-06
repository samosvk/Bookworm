import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Radio, RadioGroup, FormControlLabel, FormControl, Button, TextField, MenuItem, InputLabel, Select } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Editor() {
  const { bookId } = useParams(); //get the bookId from the URL
  const [elements, setElements] = useState([]); //store book elements in a list
  const [title, setTitle] = useState(''); //store the book title
  const [elementUpdateCount, setElementUpdateCount] = useState(0); //dummy var that tracks element update count
  const [showForm, setShowForm] = useState(false); //show form to add new element
  const [addElementType, setAddElementType] = useState('Text'); //type of element to add
  const [newElement, setNewElement] = useState({}); //store new element data to send in post request

  useEffect(() => { // Fetch book elements whenever bokId changes
    async function fetchElements() {
      try {
        //request book elements from the backend
        const response = await axios.get(`/api/book/${bookId}`);
        setElements(response.data.elements);
        setTitle(response.data.book.title);
      } catch (error) {
        console.error('Error fetching elements:', error);
      }
    }

    fetchElements();
  }, [bookId, elementUpdateCount]); // rerender if elements or bookid updated. Use counter to avoid infinite loop.

  //Render textboxes based on element type
  const renderTextBoxes = () => {
    switch (addElementType) {
      case "Text":
        return (
          <div>
          <TextField fullWidth multiline rows={4} style={{minWidth: '300px'}}
          label="Enter Text" 
          onChange={(e) => setNewElement({ ...newElement, text: e.target.value })} />
          </div>
        );
      case "MultipleChoice":
        return (
          <div>
            <TextField label="Question" onChange={(e) => setNewElement({ ...newElement, question: e.target.value })} />
            <TextField label="Options (comma seperated)" onChange={(e) => setNewElement({ ...newElement, options: e.target.value.split(',') })} />
            <TextField label="Answer" onChange={(e) => setNewElement({ ...newElement, answer: e.target.value })} />
          </div>
        );
      case "FillBlank":
        return (
          <div>
            <TextField label="Question" onChange={(e) => setNewElement({ ...newElement, question: e.target.value })} />
            <TextField label="Answer" onChange={(e) => setNewElement({ ...newElement, answer: e.target.value })} />
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
          <Button variant='outlined' color='primary' onClick={() => setShowForm(false)}>
            Cancel
          </Button>
          <FormControl>
            <InputLabel id="dropdown-label">Select an option</InputLabel>
            <Select
              labelId="dropdown-label"
              id="dropdown"
              value={addElementType}
              onChange={(event) => setAddElementType(event.target.value)}
            >
              <MenuItem value="Text">Text</MenuItem>
              <MenuItem value="MultipleChoice">Multiple Choice</MenuItem>
              <MenuItem value="FillBlank">Fill in the Blank</MenuItem>
            </Select>
            {renderTextBoxes()}
          </FormControl>
        </div>
      );
    } else {
      return (
        <div>
          <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
            Add Element
          </Button>
        </div>
      );
    }
  }
  //Remove associated element
  const handleRemove = async (elementId) => {
    try {
      const response = await axios.delete(`/api/editor/${bookId}/${elementId}`);
      setElementUpdateCount(elementUpdateCount + 1);
    } catch (error) {
      console.error('Error submitting element:', error);
    }
  };
  
  //Add new element
  const handleAdd = async () => {
    try {
      const response = await axios.post(`/api/editor/${bookId}/`, {type: addElementType, element: newElement});
      setShowForm(false); // hide the form after adding
      setElementUpdateCount(elementUpdateCount + 1);
      setNewElement({}); // clear new element
    } catch (error) {
      console.error('Error submitting element:', error);
    }
  }

  const renderElementContent = (element) => {
    if (element.element_type === 'MultipleChoice') {
      return (
        <div key={element.id}>
          <div>
            <Typography variant="subtitle1">Question: {element.content_object.question}</Typography>
            <FormControl component="fieldset">
              <RadioGroup aria-label={`question-${element.id}`} name={`question-${element.id}`}>
                {element.content_object.options.map((option, optionIndex) =>
                  <FormControlLabel
                    key={optionIndex}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                )}
              </RadioGroup>
            </FormControl>
          </div>
          <div>
            <Button variant="outlined" color="primary" onClick={() => handleRemove(element.id)}>
              Remove
            </Button>
          </div>
        </div>
      );
    } else if (element.element_type === 'Text') {
      return (
        <div key={element.id}>
          <Typography variant="subtitle1" style={{ whiteSpace: 'pre-line' }}>{element.content_object.text}</Typography>
          <div>
            <Button variant="outlined" color="primary" onClick={() => handleRemove(element.id)}>
              Remove
            </Button>
          </div>
        </div>
      );
    } else if (element.element_type === 'FillBlank') {
      return (
        <div key={element.id}>
          <Typography variant="subtitle1">Question: {element.content_object.question}</Typography>
          <TextField
            label="Answer"
            variant="outlined"
          />
          <div>
            <Button variant="outlined" color="primary" onClick={() => handleRemove(element.id)}>
              Remove
            </Button>
          </div>
        </div>
      );

    } else {
      return null; // Handle other types if needed
    }
  };

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
        <Typography variant="h4">{title}</Typography>
        <div>
          {elements.map(element => ( // Render each element
            renderElementContent(element)
          ))}
        </div>
        <div>
          {displayAddForm()}
        </div>
      </Paper>
    </Container>
  );
}

export default Editor;
