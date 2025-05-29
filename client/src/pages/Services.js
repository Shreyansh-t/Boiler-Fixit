import React, { useState } from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  CardMedia,
  Box,
} from '@mui/material';

// --- local images ---
import plumbingImg   from '/Users/thispc/Documents/React/Boiler-FIxIt/Boiler-Fixit/client/src/Images/Plumbing.jpg';
import bicyleImg     from '/Users/thispc/Documents/React/Boiler-FIxIt/Boiler-Fixit/client/src/Images/Bicycle.jpg';
import electronicsImg from '/Users/thispc/Documents/React/Boiler-FIxIt/Boiler-Fixit/client/src/Images/Electronics.jpg';
import furnitureImg  from '/Users/thispc/Documents/React/Boiler-FIxIt/Boiler-Fixit/client/src/Images/Furniture.jpg';
import haircutImg    from '/Users/thispc/Documents/React/Boiler-FIxIt/Boiler-Fixit/client/src/Images/Haircut.jpg';
import technicalImg  from '/Users/thispc/Documents/React/Boiler-FIxIt/Boiler-Fixit/client/src/Images/Technical.jpg';

const Services = () => {
  const services = [
    { title: 'Plumbing Repairs',   description: 'Fix leaks, unclog drains, and more',            image: plumbingImg },
    { title: 'Bicycle Maintenance', description: 'Tune-ups, repairs, and parts replacement',     image: bicyleImg   },
    { title: 'Electronics Repair',  description: 'Computer, phone, and device repairs',          image: electronicsImg },
    { title: 'Furniture Assembly',  description: 'Assembly and repair of furniture',             image: furnitureImg },
    { title: 'Haircut',             description: 'Professional haircuts and styling services',   image: haircutImg   },
    { title: 'Technical Help',      description: 'Software troubleshooting and technical support', image: technicalImg },
  ];

  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom sx={{ my: 4 }}>
        Our Services
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Search Services"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4 }}
      />

      {/*  ►►  updated Grid  ◄◄ */}
      <Grid container spacing={4} alignItems="stretch">
        {filteredServices.map((service, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            sx={{ display: 'flex' }}            // let the card stretch
          >
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',                // fill the entire grid cell
                width: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
              }}
            >
              <Box sx={{ position: 'relative', paddingTop: '66.67%' /* 3:2 ratio */ }}>
                <CardMedia
                  component="img"
                  image={service.image}
                  alt={service.title}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              <CardHeader
                title={service.title}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  py: 1.5,
                  '& .MuiCardHeader-title': { fontSize: '1.25rem', fontWeight: 'bold' },
                }}
              />

              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  height: '80px',               // fixed description height
                }}
              >
                <Typography variant="body1">{service.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services;
