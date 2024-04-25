import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import { Logout } from "@mui/icons-material"; // Import logout icon from MUI
import HomeIcon from "@mui/icons-material/Home";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const response = await axios.get("/api/user_info/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setUsername(response.data.username);
          setLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = () => {
    axios.post("http://localhost:8000/authenticate/logout/");
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="header-container" style={{ display: "inline-block" }}>
      <AppBar style={{ display: "block", position: "fixed", top: "0px" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bookworm
          </Typography>
          {loggedIn ? (
            <>
              <Link to="/dashboard">
                <IconButton>
                  <HomeIcon />
                </IconButton>
              </Link>
              <Select
                value={username}
                displayEmpty
                renderValue={() => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}></Avatar>
                    {username}
                  </div>
                )}
              >
                <MenuItem value={username} disabled>
                  <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}></Avatar>
                  {username}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Select>
            </>
          ) : (
            <div>
              <Button
                className="button"
                component={Link}
                to="/login"
                color="inherit"
              >
                Login
              </Button>
              <Button
                className="button"
                component={Link}
                to="/register"
                color="inherit"
              >
                Register
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
