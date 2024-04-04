import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Select, MenuItem, Avatar } from '@mui/material';
import { Logout } from '@mui/icons-material'; // Import logout icon from MUI
import HomeIcon from '@mui/icons-material/Home';

const Header = () => {
    const [username, setUsername] = useState('');
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    const response = await axios.get('/api/dashboard/', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    });
                    setUsername(response.data.username);
                }
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();
    }, []);

    const handleLogout = () => {
        axios.post('http://localhost:8000/authenticate/logout/')
        // For example, clear localStorage and redirect to login page
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Bookworm
                </Typography>
                <Link to='/dashboard'>
                    <IconButton >
                        <HomeIcon />
                    </IconButton>
                </Link>
                <Select
                    value={username}
                    displayEmpty
                    renderValue={() => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}></Avatar>
                            {username}
                        </div>
                    )}
                >
                    <MenuItem value={username} disabled>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}></Avatar>
                        {username}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <Logout sx={{ mr: 1 }} />
                        Logout
                    </MenuItem>
                </Select>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
