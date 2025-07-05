import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Alert } from '@mui/material';
import Payment from '../components/Payment';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceRequest } = location.state || {};

  // Redirect if no service request data
  if (!serviceRequest) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Alert severity="error">
          No service request found. Please go back to your cart.
        </Alert>
      </Container>
    );
  }

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    
    // Navigate to success page or dashboard
    navigate('/payment-success', { 
      state: { 
        serviceRequest,
        paymentIntent 
      } 
    });
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    // Error is already handled in the Payment component
    // You could add additional error handling here if needed
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Payment
        serviceRequest={serviceRequest}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </Container>
  );
};

export default PaymentPage; 