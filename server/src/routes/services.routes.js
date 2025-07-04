const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');

// POST /services - Add a new service
router.post('/', servicesController.addService);

// GET /services - Get all services
router.get('/', servicesController.getServices);

module.exports = router; 