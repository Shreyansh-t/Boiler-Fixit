import React from 'react';
import { Typography, Container, Grid, Card, CardContent, CardHeader } from '@mui/material';

const Services = () => {
  const services = [
    { title: 'Plumbing Repairs', description: 'Fix leaks, unclog drains, and more' },
    { title: 'Bicycle Maintenance', description: 'Tune-ups, repairs, and parts replacement' },
    { title: 'Electronics Repair', description: 'Computer, phone, and device repairs' },
    { title: 'Furniture Assembly', description: 'Assembly and repair of furniture' }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom sx={{ my: 4 }}>
        Our Services
      </Typography>
      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardHeader title={service.title} />
              <CardContent>
                <Typography variant="body1">
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services; 