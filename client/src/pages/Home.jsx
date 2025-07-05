import React, { useState, useEffect } from 'react';
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
  Fade,
  Slide,
  useTheme,
  alpha,
} from '@mui/material';
import { keyframes } from '@mui/system';
import BuildIcon from '@mui/icons-material/Build';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { useAuth } from '../contexts/AuthContext.jsx';

// Keyframe animations
const logoFall = keyframes`
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 0;
  }
  70% {
    transform: translateY(0) rotate(360deg);
    opacity: 1;
  }
  85% {
    transform: translateY(-20px) rotate(360deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
    opacity: 1;
  }
`;

const smokeAnimation = keyframes`
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-50px) scale(1);
    opacity: 0.4;
  }
  100% {
    transform: translateY(-100px) scale(1.5);
    opacity: 0;
  }
`;

const dustCloud = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0.8;
  }
  30% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.6;
  }
  60% {
    transform: scale(2) rotate(270deg);
    opacity: 0.3;
  }
  100% {
    transform: scale(3) rotate(360deg);
    opacity: 0;
  }
`;

const dustParticle = keyframes`
  0% {
    transform: translateY(0) translateX(0) scale(1) rotate(0deg);
    opacity: 0.8;
  }
  20% {
    transform: translateY(-20px) translateX(var(--random-x)) scale(1.2) rotate(90deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-30px) translateX(calc(var(--random-x) * 1.5)) scale(0.8) rotate(180deg);
    opacity: 0.4;
  }
  100% {
    transform: translateY(-10px) translateX(calc(var(--random-x) * 2)) scale(0.3) rotate(360deg);
    opacity: 0;
  }
`;

const bounceIn = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeInUp = keyframes`
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Logo animation completes after 2 seconds
    const logoTimer = setTimeout(() => {
      setLogoAnimationComplete(true);
    }, 2000);

    // Content appears after 2.5 seconds
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(contentTimer);
    };
  }, []);

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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      {/* Logo Animation Container */}
      <Box
        sx={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Main Logo */}
        <Box
          component="img"
          src="/logo/BoilerFixit Logo.png"
          alt="BoilerFixit Logo"
          sx={{
            width: { xs: 250, md: 350 },
            height: 'auto',
            animation: `${logoFall} 2s ease-out forwards`,
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
            // Remove white background
            background: 'transparent',
            // Use mix-blend-mode to blend with background and remove white
            mixBlendMode: 'multiply',
            // Make white areas transparent
            WebkitFilter: 'brightness(1.1) contrast(1.2)',
            // Alternative approach using backdrop filters
            backdropFilter: 'none',
          }}
        />

        {/* Impact Dust Cloud Effect */}
        {logoAnimationComplete && (
          <>
            {/* Main dust cloud */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 80,
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.4)} 0%, ${alpha('#D2B48C', 0.3)} 30%, transparent 70%)`,
                borderRadius: '50%',
                animation: `${dustCloud} 3s ease-out forwards`,
              }}
            />

            {/* Secondary dust clouds */}
            {[...Array(3)].map((_, i) => (
              <Box
                key={`cloud-${i}`}
                sx={{
                  position: 'absolute',
                  bottom: -25,
                  left: `${40 + i * 20}%`,
                  width: 50,
                  height: 50,
                  background: `radial-gradient(circle, ${alpha('#D2B48C', 0.3)} 0%, transparent 60%)`,
                  borderRadius: '50%',
                  animation: `${dustCloud} ${2.5 + i * 0.3}s ease-out forwards`,
                  animationDelay: `${0.2 + i * 0.1}s`,
                }}
              />
            ))}

            {/* Dust Particles scattered around impact */}
            {[...Array(20)].map((_, i) => {
              const randomX = (Math.random() - 0.5) * 200;
              const randomDelay = Math.random() * 0.5;
              return (
                <Box
                  key={`dust-${i}`}
                  sx={{
                    position: 'absolute',
                    bottom: -15,
                    left: '50%',
                    width: Math.random() * 8 + 3,
                    height: Math.random() * 8 + 3,
                    background: `${alpha(theme.palette.primary.main, 0.7)}`,
                    borderRadius: '50%',
                    animation: `${dustParticle} 3s ease-out forwards`,
                    animationDelay: `${randomDelay}s`,
                    '--random-x': `${randomX}px`,
                  }}
                />
              );
            })}

            {/* Small smoke wisps */}
            {[...Array(4)].map((_, i) => (
              <Box
                key={`smoke-${i}`}
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  left: `${35 + i * 15}%`,
                  width: 25,
                  height: 25,
                  background: `radial-gradient(circle, ${alpha('#999', 0.4)} 0%, transparent 70%)`,
                  borderRadius: '50%',
                  animation: `${smokeAnimation} ${2 + i * 0.2}s ease-out forwards`,
                  animationDelay: `${0.3 + i * 0.1}s`,
                }}
              />
            ))}
          </>
        )}
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 5, pt: 8 }}>
        {showContent && (
          <Fade in={showContent} timeout={1000}>
            <Box>
              {/* Hero Section */}
                             <Box
                 sx={{
                   textAlign: 'center',
                   mb: 8,
                   mt: { xs: 45, md: 40 },
                   animation: `${fadeInUp} 1s ease-out`,
                 }}
               >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  Your Trusted Service Partner
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    color: 'text.secondary',
                    maxWidth: 600,
                    mx: 'auto',
                    lineHeight: 1.6,
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
                          boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                          animation: `${bounceIn} 1s ease-out 0.5s both`,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
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
                          animation: `${bounceIn} 1s ease-out 0.7s both`,
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
                          boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                          animation: `${bounceIn} 1s ease-out 0.5s both`,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
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
                          animation: `${bounceIn} 1s ease-out 0.7s both`,
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
              <Grid container spacing={4} sx={{ mb: 8 }}>
                {services.map((service, index) => (
                  <Grid item xs={12} sm={6} md={3} key={service.title}>
                    <Slide
                      direction="up"
                      in={showContent}
                      timeout={1000 + index * 200}
                    >
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
                        <CardContent sx={{ p: 3 }}>
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
                        <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                          <Button
                            size="small"
                            onClick={() => navigate('/services')}
                            sx={{ color: service.color }}
                          >
                            Learn More
                          </Button>
                        </CardActions>
                      </Card>
                    </Slide>
                  </Grid>
                ))}
              </Grid>

              {/* Call to Action */}
              <Fade in={showContent} timeout={2000}>
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    borderRadius: 4,
                    mb: 4,
                  }}
                >
                  {isAuthenticated ? (
                    <>
                      <Typography variant="h4" component="h2" gutterBottom>
                        Welcome back, {user?.fullName?.split(' ')[0]}!
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
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
                      <Typography variant="h4" component="h2" gutterBottom>
                        Ready to Get Started?
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
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
              </Fade>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default Home; 