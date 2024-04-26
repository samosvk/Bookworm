import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  TextField,
  CardMedia,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function Book() {
  const { bookId } = useParams(); //get the bookId from the URL
  const [elements, setElements] = useState([]); //store book elements in a list
  const [selectedOptions, setSelectedOptions] = useState({}); //make a dict to store selected options
  const [correctAnswers, setCorrectAnswers] = useState({}); //make a dict to track correctness of answers
  const [title, setTitle] = useState(""); //store the book title
  const [isSuperUser, setIsSuperUser] = useState(false); //store the user's superuser status
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    // Fetch book elements whenever bokId changes
    async function fetchElements() {
      try {
        //request book elements from the backend
        const response = await axios.get(`/api/book/${bookId}`, {
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
  }, [bookId]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (accessToken) {
          const response = await axios.get("/api/user_info/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setIsSuperUser(response.data.is_superuser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();
  }, []);

  const handleOptionChange = (elementId, option) => {
    setSelectedOptions((prevState) => ({
      //create copy of previous state and update it
      ...prevState,
      [elementId]: option,
    }));
  };

  const handleSubmit = async (elementId) => {
    const selectOption = selectedOptions[elementId];
    if (selectOption != null) {
      try {
        const response = await axios.post(
          `/api/book/${bookId}/${elementId}`,
          { option: selectOption },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const { is_correct } = response.data;
        setCorrectAnswers((prevState) => ({
          ...prevState,
          [elementId]: is_correct,
        }));
      } catch (error) {
        console.error("Error submitting element:", error);
      }
    }
  };

  const renderElementContent = (element, index) => {
    const isCorrect = correctAnswers[element.id];
    if (element.element_type === "MultipleChoice") {
      return (
        <div key={element.id} style={{ marginBottom: "20px" }}>
          <div>
            <Typography variant="subtitle1">
              Question: {element.content_object.question}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label={`question-${element.id}`}
                name={`question-${element.id}`}
              >
                {element.content_object.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={option}
                    control={<Radio />}
                    label={option}
                    onChange={() => handleOptionChange(element.id, option)} //update the selected option
                  />
                ))}
              </RadioGroup>
            </FormControl>
            {isCorrect == true && <CheckIcon sx={{ color: "green" }} />}
            {isCorrect == false && <CloseIcon sx={{ color: "red" }} />}
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit(element.id)}
            >
              Submit
            </Button>
          </div>
        </div>
      );
    } else if (element.element_type === "Text") {
      return (
        <div key={element.id} style={{ marginBottom: "20px" }}>
          <Typography variant="subtitle1" style={{ whiteSpace: "pre-line" }}>
            {element.content_object.text}
          </Typography>
        </div>
      );
    } else if (element.element_type === "FillBlank") {
      return (
        <div key={element.id} style={{ marginBottom: "20px" }}>
          <Typography variant="subtitle1">
            Question: {element.content_object.question}
          </Typography>
          <TextField
            label="Answer"
            variant="outlined"
            onChange={(e) => handleOptionChange(element.id, e.target.value)} //update the selected option
          />
          {isCorrect == true && <CheckIcon sx={{ color: "green" }} />}
          {isCorrect == false && <CloseIcon sx={{ color: "red" }} />}
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit(element.id)}
            >
              Submit
            </Button>
          </div>
        </div>
      );
    } else if (element.element_type === "Video") {
      return (
        <div
          key={element.id}
          style={{
            marginBottom: "20px",
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
          {/* render button to view editor if sudo */}
          {isSuperUser && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link to={`/editor/${bookId}`}>
                <Button>View Editor</Button>
              </Link>
            </div>
          )}
          <div style={{ paddingRight: "20px", paddingLeft: "20px" }}>
            {elements.map(
              (
                element // Render each element
              ) => renderElementContent(element)
            )}
          </div>
        </Paper>
      </Container>
    </div>
  );
}

export default Book;
