import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import axios from "axios";

export default function LogIn() {
  const [loginStatus, setLoginStatus] = useState(undefined);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post(
        "http://localhost:8000/authenticate/login/",
        data,
        {
          withCredentials: true, // Allow sending cookies along with the request
        }
      );

      if (response.status === 200) {
        const { access_token } = response.data;
        // Store the token in local storage or context
        localStorage.setItem("accessToken", access_token);
        // Set login status to true
        setLoginStatus(true);
        // Redirect or navigate to the desired location
        navigate("/dashboard");
      } else {
        console.error("Failed to submit form", response.data);
        // Set the error
        setLoginStatus(false);
      }
    } catch (error) {
      console.error("Error", error);
      // Set login status to false
      setLoginStatus(false);
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
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
          method="post"
        >
          {/* Include CSRF token in the form */}
          {/* <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} /> */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            className="button"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          {/* add login feedback */}
          <div>
            {loginStatus == false && (
              <p style={{ color: "red" }}>login failed</p>
            )}
          </div>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
