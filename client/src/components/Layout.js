import React from 'react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

const Layout = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BoilerFixIt
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/services">
            Services
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ mt: 4 }}>
          <Outlet />
        </Box>
      </Container>
    </>
  );
};

export default Layout; 