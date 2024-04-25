import React from "react";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./Home.css";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import Header from "./Header";
import Footer from "./Footer";
export default function Homepage() {
  return (
    <div className="homepage">
      <Header />
      <div className="App">
        <div className="App-container">
          <div class="book">
            <div class="book__pg-shadow"></div>
            <div class="book__pg"></div>
            <div class="book__pg book__pg--2"></div>
            <div class="book__pg book__pg--3"></div>
            <div class="book__pg book__pg--4"></div>
            <div class="book__pg book__pg--5"></div>
          </div>
          <div className="site-title">
            <Typography
              className="title"
              variant="h1"
              gutterBottom
              style={{ fontWeight: "bolder" }}
            >
              Welcome to Bookworm
            </Typography>
          </div>
          <div className="hero">
            <Grid item xs={9} className="content-container">
              <div>
                <Typography
                  variant="h4"
                  gutterBottom
                  style={{
                    fontWeight: "500",
                    lineHeight: "2.5rem",
                  }}
                >
                  A tool allowing users to make and user interactive lessons.
                </Typography>
              </div>
            </Grid>
            <div>
              <Grid item xs={9} className="content-container">
                <Stack spacing={2} direction="row">
                  <Link to="https://justinklonoski25.github.io/WEBSITE/">
                    <Button
                      className="learnmore"
                      variant="contained"
                      sx={{ padding: "25px 40px" }}
                    >
                      Learn More
                    </Button>
                  </Link>
                </Stack>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
