import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ serviceRequest, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required'
    });

    if (error) {
      setError(error.message);
      onPaymentError(error);
    } else {
      // Payment succeeded - now simulate the webhook for local testing
      try {
        const token = localStorage.getItem('token');
        await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8001'}/payment/simulate-success`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id
          })
        });
      } catch (simulateError) {
        console.error('Error simulating webhook:', simulateError);
      }
      
      onPaymentSuccess(paymentIntent);
    }

    setIsProcessing(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Secure payment powered by
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#635bff',
                  fontSize: '16px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                Stripe
              </Typography>
            </Box>
          <PaymentElement 
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
              fields: {
                billingDetails: {
                  name: 'auto',
                  email: 'auto',
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || isProcessing}
        sx={{ mt: 2 }}
      >
        {isProcessing ? (
          <CircularProgress size={24} />
        ) : (
          `Pay $${serviceRequest.pricing.total}`
        )}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          🔒 Powered by Stripe • Your payment information is secure
        </Typography>
      </Box>
    </Box>
  );
};

const Payment = ({ serviceRequest, onPaymentSuccess, onPaymentError }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check if Stripe is properly configured
  const isStripeConfigured = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY && 
                             process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY !== 'pk_test_placeholder';

  useEffect(() => {
    if (!isStripeConfigured) {
      setIsLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8001'}/payment/create-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            serviceRequestId: serviceRequest.id
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          setClientSecret(data.clientSecret);
        } else {
          console.error('Failed to create payment intent:', data.message);
        }
      } catch (err) {
        console.error('Failed to initialize payment:', err);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [serviceRequest.id, isStripeConfigured]);

  if (!isStripeConfigured) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Setup Required
          </Typography>
          <Typography variant="body2">
            Stripe is not configured. Please add your Stripe publishable key to the .env file:
            <br />
            <code>REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here</code>
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Initializing secure payment...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Complete Your Payment
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          
          {serviceRequest.services.map((service, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  {service.serviceName} × {service.quantity}
                </Typography>
                <Typography variant="body2">
                  ${(service.price * service.quantity).toFixed(2)}
                </Typography>
              </Box>
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
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">${serviceRequest.pricing.total.toFixed(2)}</Typography>
          </Box>
        </CardContent>
      </Card>

      {clientSecret && (
        <Elements 
          stripe={stripePromise}
          options={{
            clientSecret: clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#CFB991',
                colorBackground: '#ffffff',
                colorText: '#000000',
                colorDanger: '#df1b41',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
              },
              rules: {
                '.Label': {
                  fontWeight: '500',
                  marginBottom: '8px',
                },
                '.Input': {
                  padding: '12px',
                  fontSize: '16px',
                },
                '.Tab': {
                  padding: '12px 16px',
                  fontSize: '16px',
                },
              },
            },
          }}
        >
          <CheckoutForm
            serviceRequest={serviceRequest}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
          />
        </Elements>
      )}
    </Box>
  );
};

export default Payment; 