import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  alpha,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { useAuth } from '../contexts/AuthContext.jsx';


const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();

  const services = [
    {
      title: 'Plumbing',
      description: 'Expert plumbing repairs and installations',
      icon: <PlumbingIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: '#2196F3'
    },
    {
      title: 'Electrical',
      description: 'Safe and reliable electrical services',
      icon: <ElectricalServicesIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      color: '#FF9800'
    },
    {
      title: 'Repairs',
      description: 'General maintenance and repair services',
      icon: <BuildIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      color: '#4CAF50'
    },
    {
      title: 'Cleaning',
      description: 'Professional cleaning and maintenance',
      icon: <CleaningServicesIcon sx={{ fontSize: 40, color: '#9C27B0' }} />,
      color: '#9C27B0'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.1)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.05)} 50%, 
          ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Logo Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 3, md: 4 },
            mt: { xs: 2, md: 3 },
          }}
        >
          <Box
            component="img"
            src="/logo/BoilerFixit Logo.png"
            alt="BoilerFixit Logo"
            sx={{
              width: { xs: 180, md: 280 },
              height: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
            }}
          />
        </Box>

        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: { xs: 1.5, md: 2 },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Your Trusted Service Partner
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: { xs: 3, md: 4 },
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            Professional home services at your fingertips. From plumbing to electrical work, we've got you covered.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/services')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Book a Service
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/profile')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  My Profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/services')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Browse Services
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={3} key={service.title}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  boxShadow: `0 4px 20px ${alpha('#000', 0.1)}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${alpha(service.color, 0.2)}`,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ mb: 2 }}>
                    {service.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: { xs: 2, md: 3 } }}>
                  <Button
                    size="small"
                    onClick={() => navigate('/services')}
                    sx={{ color: service.color }}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 4, md: 6 },
            px: { xs: 3, md: 4 },
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
            borderRadius: 4,
            mb: { xs: 2, md: 4 },
          }}
        >
          {isAuthenticated ? (
            <>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                Welcome back, {user?.fullName?.split(' ')[0]}!
              </Typography>
              <Typography variant="body1" sx={{ mb: { xs: 2, md: 3 }, color: 'text.secondary' }}>
                Ready to book your next service? Our team is here to help with all your home needs.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/services')}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                }}
              >
                Book a Service
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                Ready to Get Started?
              </Typography>
              <Typography variant="body1" sx={{ mb: { xs: 2, md: 3 }, color: 'text.secondary' }}>
                Join thousands of satisfied customers who trust BoilerFixit for their home service needs.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                }}
              >
                Get Started Today
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 