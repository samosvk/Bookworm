import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

export default function Register() {
  const [registrationStatus, setRegistrationStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new URLSearchParams(new FormData(event.currentTarget));
    try {
      const response = await fetch(
        "http://localhost:8000/authenticate/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data.toString(),
          credentials: "include",
        }
      );
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        //go to the login page if registration is successful
        navigate("/login");
      } else {
        const errorData = await response.json();
        if (
          errorData.non_field_errors &&
          errorData.non_field_errors.length > 0
        ) {
          // if the error is from serializer's test, set status to it
          setRegistrationStatus("Error: " + errorData.non_field_errors[0]);
        } else if (errorData.username && errorData.username.length > 0) {
          setRegistrationStatus("Error: " + errorData.username[0]);
        } else {
          setRegistrationStatus("Error: Failed to submit form");
        }
        console.error("Failed to submit form", errorData);
        //set status to indicate failure
      }
    } catch (error) {
      setRegistrationStatus("Error with promise");
      console.error("Error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
          method="post"
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
              />
            </Grid>
          </Grid>
          <Button
            className="button"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          {/* add registration feedback */}
          <div>
            <p style={{ color: "red" }}>{registrationStatus}</p>
          </div>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
