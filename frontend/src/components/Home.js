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
            <Grid container spacing={2} className="grid-container">
              <Grid item xs={3} className="image-container">
                <AcUnitIcon
                  className="icon"
                  sx={{ height: "300px", width: "300px", color: "orange" }}
                />
              </Grid>
              <Grid item xs={9} className="content-container">
                <div>
                  <Typography
                    variant="h4"
                    gutterBottom
                    style={{ fontWeight: "500", lineHeight: "2.5rem" }}
                  >
                    A tool allowing users to collaborate on creating online
                    textbooks and class documents.
                  </Typography>
                </div>
                <div>
                  <Stack spacing={2} direction="row">
                    <Link to="/">
                      <Button
                        className="learnmore"
                        variant="contained"
                        sx={{ padding: "25px 40px" }}
                      >
                        Learn More
                      </Button>
                    </Link>
                  </Stack>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
