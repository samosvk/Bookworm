import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Radio, RadioGroup, FormControlLabel, FormControl, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BookElements() {
  const {bookId} = useParams();
  const [elements, setElements] = useState([]);

  useEffect(() => { // Fetch book elements whenever bokId changes
    async function fetchElements() {
      try {
        //request booke elements from the backend
        const response = await axios.get(`/api/element/${bookId}`);
        setElements(response.data);
      } catch (error) {
        console.error('Error fetching elements:', error);
      }
    }

    fetchElements();
  }, [bookId]);

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
            <Button variant="contained" color="primary" onSubmit={console.log('Submitted')}>
              Submit
            </Button>
          </div>
        </div>
      );
    } else if (element.element_type === 'Text') {
      return (
        <div key={element.id}>
          <Typography variant="subtitle1" style={{whiteSpace:'pre-line'}}>{element.content_object.text}</Typography>
        </div>
      );
    } else {
      return null; // Handle other types if needed
    }
  };

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
        <Typography variant="h4">Title</Typography>
        <div>
          {elements.map(element => ( // Render each element
            renderElementContent(element)
          ))}
        </div>
      </Paper>
    </Container>
  );
}

export default BookElements;
