import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import Grid from "@mui/material/Grid";

const Footer = () => {
  return (
    <div className="footer">
      <Grid container spacing={2} className="footer-grid-container">
        <Grid item xs={4} className="logo-container">
          <h2>Bookworm</h2>
        </Grid>
        <Grid item xs={4} className="footer-icons">
          <InstagramIcon />
          <FacebookIcon />
          <GitHubIcon />
          <XIcon />
        </Grid>
        <Grid item xs={4} className="footer-links-container">
          <p>Link 1</p>
          <p>Link 2</p>
          <p>Link 3</p>
          <p>Link 4</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default Footer;
