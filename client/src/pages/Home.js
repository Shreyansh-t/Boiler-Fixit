import React from 'react';
import { Typography, Container, Box, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #CFB991 0%, #B39B6F 100%)',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Welcome to BoilerFixIt
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  color: 'white',
                  mb: 4,
                  opacity: 0.9,
                }}
              >
                Your one-stop solution for maintenance and repair services at Purdue University
              </Typography>
              {isAuthenticated ? (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/services')}
                    sx={{
                      mr: 2,
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    View Services
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={logout}
                    sx={{
                      mr: 2,
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    mr: 2,
                    mb: { xs: 2, sm: 0 },
                  }}
                >
                  Login to View Services
                </Button>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom color="primary" fontWeight="600">
                  Why Choose BoilerFixIt?
                </Typography>
                <Typography variant="body1" paragraph>
                  • Fast and reliable service
                </Typography>
                <Typography variant="body1" paragraph>
                  • Professional maintenance staff
                </Typography>
                <Typography variant="body1" paragraph>
                  • 24/7 emergency support
                </Typography>
                <Typography variant="body1">
                  • Competitive pricing for Purdue community
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Our Services
        </Typography>
        <Grid container spacing={4}>
          {['Maintenance', 'Repairs', 'Emergency Support'].map((service) => (
            <Grid item xs={12} md={4} key={service}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Typography variant="h5" component="h3" gutterBottom color="primary" fontWeight="600">
                  {service}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Professional {service.toLowerCase()} services for all your needs at Purdue University
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 