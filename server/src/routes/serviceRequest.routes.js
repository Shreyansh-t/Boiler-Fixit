const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controllers/serviceRequest.controller');
const { authUser } = require('../middlewares/auth.middleware');

// POST /service-requests - Create a new service request from cart
router.post('/', authUser, serviceRequestController.createServiceRequest);

// GET /service-requests - Get user's service requests
router.get('/', authUser, serviceRequestController.getUserServiceRequests);

// GET /service-requests/:id - Get specific service request
router.get('/:id', authUser, serviceRequestController.getServiceRequestById);

// PUT /service-requests/:id/status - Update service request status
router.put('/:id/status', authUser, serviceRequestController.updateServiceRequestStatus);

module.exports = router; 