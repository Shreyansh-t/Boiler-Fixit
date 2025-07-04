import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Badge,
  Box,
  Snackbar,
  Drawer
} from '@mui/material';
import { getServices } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';

const Services = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
        setError(null);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isInCart = (id) => cart.some((item) => item._id === id);

  const handleAdd = (service) => {
    setSelectedService(service);
    setDesc('');
    setDrawerOpen(true);
  };

  const handleSaveDesc = () => {
    if (selectedService && !isInCart(selectedService._id)) {
      setCart([...cart, { ...selectedService, desc }]);
    }
    setDrawerOpen(false);
    setSelectedService(null);
    setDesc('');
  };

  const handleRemove = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const handleCartClick = () => {
    navigate('/cart', { state: { cart } });
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedService(null);
    setDesc('');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        <IconButton color="primary" onClick={handleCartClick} size="large">
          <Badge badgeContent={cart.length} color="secondary">
            <ShoppingCartIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Box>
      <Typography variant="h3" component="h1" gutterBottom sx={{ my: 4 }}>
        Our Services
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Look up service"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4, fontSize: '1.5rem' }}
        inputProps={{ style: { fontSize: '1.5rem', padding: '20px 14px' } }}
      />

      <Grid container spacing={4} alignItems="stretch">
        {filteredServices.map((service, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={service._id || index}
            sx={{ display: 'flex' }}
          >
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
              }}
            >
              <CardMedia
                component="img"
                image={service.imgUrl}
                alt={service.name}
                sx={{ width: '100%', height: 220, objectFit: 'cover' }}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
                  {service.name}
                </Typography>
                {!isInCart(service._id) ? (
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleAdd(service)}>
                    Add
                  </Button>
                ) : (
                  <IconButton color="error" sx={{ mt: 2 }} onClick={() => handleRemove(service._id)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{ sx: { borderRadius: '16px 16px 0 0', p: 3 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Add a description (optional)</Typography>
          <IconButton onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          label="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          multiline
          minRows={2}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSaveDesc} fullWidth>
          Save
        </Button>
      </Drawer>
    </Container>
  );
};

export default Services; 