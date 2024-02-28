import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Radio, RadioGroup, FormControlLabel, FormControl, Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function Editor() {
  const {bookId} = useParams(); //get the bookId from the URL
  const [elements, setElements] = useState([]); //store book elements in a list
  const [title, setTitle] = useState(''); //store the book title
  const [elemenetUpdateCount, setElementUpdateCount] = useState(0); //dummy var that tracks element update count

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
  }, [bookId, elemenetUpdateCount]); // rerender if elements or bookid updated. Use counter to avoid infinite loop.

  //Remove associated element
  const handleRemove = async (elementId) => { 
    try {
      const response = await axios.delete(`/api/editor/${bookId}/${elementId}`);
      setElementUpdateCount(elemenetUpdateCount + 1);
    } catch(error) {
      console.error('Error submitting element:', error);
    }
  };

  const handleAdd = async () => {
    try {
      // Sending None in place of elementId to create a new element
      const response = await axios.post(`/api/editor/${bookId}`);
    } catch(error) {
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
          <Typography variant="subtitle1" style={{whiteSpace:'pre-line'}}>{element.content_object.text}</Typography>
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
            <Button variant="contained" color="primary" onClick={() => handleAdd(element.id)}> 
              Add
            </Button>
        </div>
      </Paper>
    </Container>
  );
}

export default Editor;
