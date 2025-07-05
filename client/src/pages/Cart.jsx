import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Box,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import { createServiceRequest, getUserAddresses, saveUserAddress } from '../services/api';

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressOption, setAddressOption] = useState('previous'); // 'previous', 'current', 'manual'
  const [manualAddress, setManualAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });
  const [currentLocation, setCurrentLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  
  // Real user addresses from database
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedFinalAddress, setSelectedFinalAddress] = useState(null);

  useEffect(() => {
    if (location.state?.cart) {
      // Transform cart items to include quantity and scheduling
      const itemsWithQuantity = location.state.cart.map(item => ({
        ...item,
        quantity: 1,
        scheduling: 'immediate', // 'immediate' or 'scheduled'
        scheduledDate: '',
        price: 50 // Placeholder price in dollars
      }));
      setCartItems(itemsWithQuantity);
      // Open address dialog when cart loads
      setAddressDialogOpen(true);
      // Fetch user's saved addresses
      fetchUserAddresses();
    }
  }, [location.state]);

  const fetchUserAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const addresses = await getUserAddresses();
      setPreviousAddresses(addresses);
      
      // If user has addresses, default to previous option
      if (addresses.length > 0) {
        setAddressOption('previous');
        // Set default address if available
        const defaultAddr = addresses.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(`${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.zipCode}`);
        }
      } else {
        // If no saved addresses, default to manual entry
        setAddressOption('manual');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddressOption('manual'); // Fallback to manual entry
    } finally {
      setLoadingAddresses(false);
    }
  };

  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item => 
      item._id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  const updateScheduling = (id, scheduling) => {
    setCartItems(prev => prev.map(item => 
      item._id === id 
        ? { ...item, scheduling, scheduledDate: scheduling === 'immediate' ? '' : item.scheduledDate }
        : item
    ));
  };

  const updateScheduledDate = (id, scheduledDate) => {
    setCartItems(prev => prev.map(item => 
      item._id === id 
        ? { ...item, scheduledDate }
        : item
    ));
  };

  const getCurrentLocation = () => {
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode these coordinates
          setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setAddressOption('current');
        },
        (error) => {
          setLocationError('Unable to get your location. Please try again or enter manually.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const handleAddressConfirm = async () => {
    let finalAddress = {};
    
    if (addressOption === 'previous' && selectedAddress) {
      // Find the selected address object
      const selectedAddrObj = previousAddresses.find(addr => 
        `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}` === selectedAddress
      );
      
      if (selectedAddrObj) {
        finalAddress = {
          street: selectedAddrObj.street,
          city: selectedAddrObj.city,
          state: selectedAddrObj.state,
          zipCode: selectedAddrObj.zipCode,
          country: selectedAddrObj.country,
          addressType: 'previous'
        };
      }
    } else if (addressOption === 'current' && currentLocation) {
      finalAddress = {
        street: `Current Location: ${currentLocation}`,
        city: 'Unknown',
        state: 'Unknown',
        zipCode: '00000',
        country: 'USA',
        addressType: 'current',
        coordinates: {
          latitude: parseFloat(currentLocation.split(', ')[0]),
          longitude: parseFloat(currentLocation.split(', ')[1])
        }
      };
    } else if (addressOption === 'manual') {
      finalAddress = {
        street: manualAddress.street,
        city: manualAddress.city,
        state: manualAddress.state,
        zipCode: manualAddress.zipCode,
        country: manualAddress.country,
        addressType: 'manual'
      };
      
      // Save the manually entered address for future use
      if (manualAddress.street && manualAddress.city && manualAddress.state && manualAddress.zipCode) {
        try {
          await saveUserAddress(manualAddress);
          console.log('Address saved for future use');
        } catch (error) {
          console.error('Error saving address:', error);
          // Don't block the flow if saving fails
        }
      }
    }
    
    if (finalAddress && finalAddress.street) {
      setSelectedFinalAddress(finalAddress);
      setAddressDialogOpen(false);
      console.log('Selected address:', finalAddress);
    } else {
      alert('Please select or enter a valid address');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceTax = subtotal * 0.18; // 18% service tax
  const commuteCharges = 25; // Placeholder - will be calculated based on address
  const total = subtotal + serviceTax + commuteCharges;

  const handleNext = async () => {
    try {
      // Check if address has been selected
      if (!selectedFinalAddress) {
        alert('Please select an address first');
        setAddressDialogOpen(true);
        return;
      }

      console.log('Creating service request with:');
      console.log('Cart Items:', cartItems);
      console.log('Address:', selectedFinalAddress);
      console.log('Pricing:', { subtotal, serviceTax, commuteCharges, total });

      // Create service request
      const result = await createServiceRequest(cartItems, selectedFinalAddress, {
        subtotal,
        serviceTax,
        commuteCharges,
        total
      });

      console.log('Service request created:', result);
      
      // Navigate to payment page
      navigate('/payment', { state: { serviceRequest: result.serviceRequest } });
      
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      alert(`Failed to create service request: ${error.message}`);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" onClick={() => navigate('/services')}>
            Browse Services
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Your Cart
      </Typography>
      
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card key={item._id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  {/* Service Image */}
                  <Grid item xs={12} sm={3}>
                    <CardMedia
                      component="img"
                      image={item.imgUrl}
                      alt={item.name}
                      sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1 }}
                    />
                  </Grid>
                  
                  {/* Service Details */}
                  <Grid item xs={12} sm={9}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {item.name}
                        </Typography>
                        {item.desc && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Note: {item.desc}
                          </Typography>
                        )}
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ${item.price} each
                        </Typography>
                      </Box>
                      
                      <IconButton color="error" onClick={() => removeItem(item._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    
                    {/* Quantity Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                      <Typography variant="body1" sx={{ mr: 2 }}>Quantity:</Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => updateQuantity(item._id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body1" sx={{ mx: 2, minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton size="small" onClick={() => updateQuantity(item._id, 1)}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                    
                    {/* Scheduling */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2">Schedule:</Typography>
                      <Chip
                        icon={item.scheduling === 'immediate' ? <FlashOnIcon /> : <AccessTimeIcon />}
                        label={item.scheduling === 'immediate' ? 'Immediate' : 'Schedule Later'}
                        color={item.scheduling === 'immediate' ? 'error' : 'primary'}
                        variant="outlined"
                        size="small"
                        onClick={() => updateScheduling(item._id, item.scheduling === 'immediate' ? 'scheduled' : 'immediate')}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Box>
                    
                    {/* Date/Time Picker for Scheduled Items */}
                    {item.scheduling === 'scheduled' && (
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          type="datetime-local"
                          label="Select Date & Time"
                          value={item.scheduledDate}
                          onChange={(e) => updateScheduledDate(item._id, e.target.value)}
                          size="small"
                          sx={{ minWidth: 200 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              {cartItems.map((item) => (
                <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.name} x{item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ${item.price * item.quantity}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>${subtotal}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Service Tax (18%)</Typography>
              <Typography>${serviceTax.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Commute Charges</Typography>
              <Typography>${commuteCharges}</Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Total</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={handleNext}
              sx={{ py: 1.5 }}
            >
              Next
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Address Selection Dialog */}
      <Dialog open={addressDialogOpen} maxWidth="sm" fullWidth>
        <DialogTitle>Select Your Address</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We need your address to calculate commute charges and dispatch services.
          </Typography>

          <RadioGroup
            value={addressOption}
            onChange={(e) => setAddressOption(e.target.value)}
          >
            {/* Previous Addresses */}
            {previousAddresses.length > 0 && (
              <>
                <FormControlLabel
                  value="previous"
                  control={<Radio />}
                  label="Use Previous Address"
                />
                {addressOption === 'previous' && (
                  <Box sx={{ ml: 4, mb: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Select Address</InputLabel>
                      <Select
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        label="Select Address"
                      >
                        {previousAddresses.map((addr) => (
                          <MenuItem key={addr.id} value={`${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`}>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {addr.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </>
            )}

            {/* Current Location */}
            <FormControlLabel
              value="current"
              control={<Radio />}
              label="Use Current Location"
            />
            {addressOption === 'current' && (
              <Box sx={{ ml: 4, mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<LocationOnIcon />}
                  onClick={getCurrentLocation}
                  size="small"
                  sx={{ mb: 1 }}
                >
                  Get Current Location
                </Button>
                {currentLocation && (
                  <Typography variant="body2" color="success.main">
                    Location: {currentLocation}
                  </Typography>
                )}
                {locationError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {locationError}
                  </Alert>
                )}
              </Box>
            )}

            {/* Manual Entry */}
            <FormControlLabel
              value="manual"
              control={<Radio />}
              label="Enter Address Manually"
            />
            {addressOption === 'manual' && (
              <Box sx={{ ml: 4, mb: 2 }}>
                                 <Grid container spacing={2}>
                   <Grid item xs={12}>
                     <TextField
                       fullWidth
                       label="Address Label (e.g., Home, Work)"
                       value={manualAddress.label}
                       onChange={(e) => setManualAddress({...manualAddress, label: e.target.value})}
                       size="small"
                     />
                   </Grid>
                   <Grid item xs={12}>
                     <TextField
                       fullWidth
                       label="Street Address"
                       value={manualAddress.street}
                       onChange={(e) => setManualAddress({...manualAddress, street: e.target.value})}
                       size="small"
                     />
                   </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={manualAddress.city}
                      onChange={(e) => setManualAddress({...manualAddress, city: e.target.value})}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="State"
                      value={manualAddress.state}
                      onChange={(e) => setManualAddress({...manualAddress, state: e.target.value})}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={manualAddress.zipCode}
                      onChange={(e) => setManualAddress({...manualAddress, zipCode: e.target.value})}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={manualAddress.country}
                      onChange={(e) => setManualAddress({...manualAddress, country: e.target.value})}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddressConfirm}>
            Confirm Address
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart; 