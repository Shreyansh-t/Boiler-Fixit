import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Button,
  Divider,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceRequest, paymentIntent } = location.state || {};

  // Redirect if no data
  if (!serviceRequest || !paymentIntent) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Alert severity="error">
          No payment information found. Please contact support if you completed a payment.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your service request has been created and payment has been processed.
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Confirmation
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Service Request ID
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {serviceRequest.id}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Payment ID
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {paymentIntent.id}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip 
              label="Paid" 
              color="success" 
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Services Ordered
          </Typography>
          
          {serviceRequest.services.map((service, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {service.serviceName}
                </Typography>
                <Typography variant="body1">
                  ${(service.price * service.quantity).toFixed(2)}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Quantity: {service.quantity}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Scheduling: {service.scheduling === 'immediate' ? 'Immediate' : `Scheduled for ${new Date(service.scheduledDate).toLocaleString()}`}
              </Typography>
              
              {service.description && (
                <Typography variant="body2" color="text.secondary">
                  Notes: {service.description}
                </Typography>
              )}
              
              {index < serviceRequest.services.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">${serviceRequest.pricing.subtotal.toFixed(2)}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Service Tax (18%)</Typography>
            <Typography variant="body2">${serviceRequest.pricing.serviceTax.toFixed(2)}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Commute Charges</Typography>
            <Typography variant="body2">${serviceRequest.pricing.commuteCharges.toFixed(2)}</Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total Paid</Typography>
            <Typography variant="h6">${serviceRequest.pricing.total.toFixed(2)}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Service Address
          </Typography>
          
          <Typography variant="body1">
            {serviceRequest.address.street}<br />
            {serviceRequest.address.city}, {serviceRequest.address.state} {serviceRequest.address.zipCode}<br />
            {serviceRequest.address.country}
          </Typography>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>What's Next?</strong><br />
          We're now finding the best service providers for your request. You'll receive notifications about provider assignments and scheduling updates.
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/services')}
        >
          Book More Services
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentSuccess; 