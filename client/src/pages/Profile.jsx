import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Person,
  Email,
  LocationOn,
  History,
  Edit
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user addresses
        const addressResponse = await axios.get('http://localhost:8001/user/addresses');
        setAddresses(addressResponse.data.addresses || []);

        // Fetch user service requests (if endpoint exists)
        try {
          const serviceResponse = await axios.get('http://localhost:8001/api/service-requests/user');
          setServiceRequests(serviceResponse.data.serviceRequests || []);
        } catch (err) {
          console.log('Service requests endpoint not available');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'in-progress': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 3,
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              {user?.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, fontSize: '1.2rem' }} />
              {user?.email}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Edit Profile
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          {/* Saved Addresses */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1 }} />
                  Saved Addresses ({addresses.length})
                </Typography>
                {addresses.length > 0 ? (
                  <List dense>
                    {addresses.slice(0, 3).map((address, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={address.label}
                          secondary={`${address.street}, ${address.city}, ${address.state} ${address.zipCode}`}
                        />
                        {address.isDefault && (
                          <Chip label="Default" size="small" color="primary" />
                        )}
                      </ListItem>
                    ))}
                    {addresses.length > 3 && (
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={`+${addresses.length - 3} more addresses`}
                          sx={{ color: 'text.secondary' }}
                        />
                      </ListItem>
                    )}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No saved addresses yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Service History */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <History sx={{ mr: 1 }} />
                  Service History ({serviceRequests.length})
                </Typography>
                {serviceRequests.length > 0 ? (
                  <List dense>
                    {serviceRequests.slice(0, 3).map((request, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={request.serviceName}
                          secondary={new Date(request.createdAt).toLocaleDateString()}
                        />
                        <Chip
                          label={request.status}
                          size="small"
                          color={getStatusColor(request.status)}
                        />
                      </ListItem>
                    ))}
                    {serviceRequests.length > 3 && (
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={`+${serviceRequests.length - 3} more services`}
                          sx={{ color: 'text.secondary' }}
                        />
                      </ListItem>
                    )}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No service history yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Account Stats */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {serviceRequests.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Services
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {addresses.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Saved Addresses
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Member Since
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 