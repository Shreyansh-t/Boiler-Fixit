const ServiceRequest = require('../models/serviceRequest.model');

// Initialize Stripe with error handling
let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set in environment variables');
    console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('STRIPE')));
  } else {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('Stripe initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Stripe:', error.message);
}

// Create payment intent for service request
exports.createPaymentIntent = async (req, res) => {
  try {
    const { serviceRequestId } = req.body;
    
    // Get the service request
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    
    // Check if user owns this service request
    if (serviceRequest.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to service request' });
    }
    
    // Check if already paid
    if (serviceRequest.isPaid) {
      return res.status(400).json({ message: 'Service request already paid' });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(serviceRequest.pricing.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        serviceRequestId: serviceRequestId,
        userId: req.user.id
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    // Update service request with payment intent ID
    serviceRequest.paymentId = paymentIntent.id;
    serviceRequest.paymentStatus = 'processing';
    await serviceRequest.save();
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
    
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

// Webhook to handle payment completion
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update service request as paid
      try {
        const serviceRequest = await ServiceRequest.findOne({ 
          paymentId: paymentIntent.id 
        });
        
        if (serviceRequest) {
          serviceRequest.isPaid = true;
          serviceRequest.paymentStatus = 'completed';
          serviceRequest.overallStatus = 'paid';
          await serviceRequest.save();
          
          console.log('Service request marked as paid:', serviceRequest._id);
          
          // Here you could trigger provider assignment logic
          // await assignProviders(serviceRequest);
        }
      } catch (error) {
        console.error('Error updating service request after payment:', error);
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Update service request as failed
      try {
        const serviceRequest = await ServiceRequest.findOne({ 
          paymentId: failedPayment.id 
        });
        
        if (serviceRequest) {
          serviceRequest.paymentStatus = 'failed';
          await serviceRequest.save();
          
          console.log('Service request marked as payment failed:', serviceRequest._id);
        }
      } catch (error) {
        console.error('Error updating service request after payment failure:', error);
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
};

// Get payment status for a service request
exports.getPaymentStatus = async (req, res) => {
  try {
    const { serviceRequestId } = req.params;
    
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    
    // Check if user owns this service request
    if (serviceRequest.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to service request' });
    }
    
    res.json({
      isPaid: serviceRequest.isPaid,
      paymentStatus: serviceRequest.paymentStatus,
      paymentId: serviceRequest.paymentId,
      overallStatus: serviceRequest.overallStatus
    });
    
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
};

// For local testing - simulate payment success (remove in production)
exports.simulatePaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    // Find service request by payment intent ID
    const serviceRequest = await ServiceRequest.findOne({ 
      paymentId: paymentIntentId 
    });
    
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }
    
    // Check if user owns this service request
    if (serviceRequest.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to service request' });
    }
    
    // Update service request as paid (simulating webhook)
    serviceRequest.isPaid = true;
    serviceRequest.paymentStatus = 'completed';
    serviceRequest.overallStatus = 'paid';
    await serviceRequest.save();
    
    console.log('Payment simulated successfully for service request:', serviceRequest._id);
    
    res.json({
      message: 'Payment simulated successfully',
      serviceRequest: {
        id: serviceRequest._id,
        isPaid: serviceRequest.isPaid,
        paymentStatus: serviceRequest.paymentStatus,
        overallStatus: serviceRequest.overallStatus
      }
    });
    
  } catch (error) {
    console.error('Error simulating payment:', error);
    res.status(500).json({ message: 'Failed to simulate payment' });
  }
}; 