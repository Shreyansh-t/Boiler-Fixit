import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to BoilerFixIt
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Your one-stop solution for maintenance and repair services at Purdue University
        </Typography>
      </Box>
    </Container>
  );
};

export default Home; 