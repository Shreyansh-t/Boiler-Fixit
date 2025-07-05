const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authUser } = require('../middlewares/auth.middleware');

// POST /payment/create-intent - Create payment intent
router.post('/create-intent', authUser, paymentController.createPaymentIntent);

// POST /payment/webhook - Stripe webhook (no auth needed)
router.post('/webhook', express.raw({type: 'application/json'}), paymentController.handleWebhook);

// GET /payment/status/:serviceRequestId - Get payment status
router.get('/status/:serviceRequestId', authUser, paymentController.getPaymentStatus);

// POST /payment/simulate-success - For local testing only
router.post('/simulate-success', authUser, paymentController.simulatePaymentSuccess);

module.exports = router; 