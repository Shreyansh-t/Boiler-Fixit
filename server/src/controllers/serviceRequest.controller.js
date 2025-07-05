const ServiceRequest = require('../models/serviceRequest.model');
const User = require('../models/user.model');

// Create a new service request from cart data
exports.createServiceRequest = async (req, res) => {
  try {
    console.log('=== Service Request Creation Started ===');
    console.log('User ID:', req.user?.id);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    
    const { cartItems, address, pricing } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate required data
    if (!cartItems || !cartItems.length) {
      console.log('ERROR: Cart items missing or empty');
      return res.status(400).json({ message: 'Cart items are required' });
    }
    
    if (!address) {
      console.log('ERROR: Address missing');
      return res.status(400).json({ message: 'Address is required' });
    }

    console.log('Validation passed, transforming cart items...');

    // Transform cart items to service request format
    const services = cartItems.map(item => ({
      serviceId: item._id,
      serviceName: item.name,
      quantity: item.quantity,
      description: item.desc || '',
      price: item.price,
      scheduling: item.scheduling,
      scheduledDate: item.scheduledDate ? new Date(item.scheduledDate) : undefined,
      status: 'pending'
    }));

    console.log('Transformed services:', JSON.stringify(services, null, 2));

    // Calculate pricing if not provided
    const subtotal = services.reduce((sum, service) => sum + (service.price * service.quantity), 0);
    const serviceTax = subtotal * 0.18;
    const commuteCharges = pricing?.commuteCharges || 25; // Use provided or default
    const total = subtotal + serviceTax + commuteCharges;

    console.log('Calculated pricing:', { subtotal, serviceTax, commuteCharges, total });

    // Create service request
    const serviceRequestData = {
      userId,
      services,
      address,
      isPaid: false, // Will be set to true by Stripe webhook
      paymentStatus: 'pending', // Will be updated by payment flow
      paymentMethod: 'card', // Default payment method
      pricing: {
        subtotal,
        serviceTax,
        commuteCharges,
        total
      },
      overallStatus: 'pending_payment', // Will be updated after payment
      urgency: 'medium' // Default urgency
    };

    console.log('Creating service request with data:', JSON.stringify(serviceRequestData, null, 2));

    const serviceRequest = new ServiceRequest(serviceRequestData);
    await serviceRequest.save();

    console.log('Service request saved successfully:', serviceRequest._id);

    res.status(201).json({
      message: 'Service request created successfully',
      serviceRequest: {
        id: serviceRequest._id,
        services: serviceRequest.services,
        address: serviceRequest.address,
        pricing: serviceRequest.pricing,
        overallStatus: serviceRequest.overallStatus,
        createdAt: serviceRequest.createdAt
      }
    });

  } catch (error) {
    console.error('=== Service Request Creation Error ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to create service request', 
      error: error.message 
    });
  }
};

// Get user's service requests
exports.getUserServiceRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const serviceRequests = await ServiceRequest.find({ userId })
      .populate('services.serviceId', 'name imgUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Service requests retrieved successfully',
      serviceRequests
    });

  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ 
      message: 'Failed to fetch service requests', 
      error: error.message 
    });
  }
};

// Get service request by ID
exports.getServiceRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const serviceRequest = await ServiceRequest.findOne({ _id: id, userId })
      .populate('services.serviceId', 'name imgUrl description')
      .populate('assignedProviders.providerId', 'name email phone');

    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.status(200).json({
      message: 'Service request retrieved successfully',
      serviceRequest
    });

  } catch (error) {
    console.error('Error fetching service request:', error);
    res.status(500).json({ 
      message: 'Failed to fetch service request', 
      error: error.message 
    });
  }
};

// Update service request status (for admin/provider use)
exports.updateServiceRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { overallStatus, serviceStatus } = req.body;

    const serviceRequest = await ServiceRequest.findById(id);
    
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    if (overallStatus) {
      serviceRequest.overallStatus = overallStatus;
    }

    if (serviceStatus) {
      // Update individual service statuses
      serviceStatus.forEach(update => {
        const service = serviceRequest.services.id(update.serviceId);
        if (service) {
          service.status = update.status;
        }
      });
    }

    await serviceRequest.save();

    res.status(200).json({
      message: 'Service request updated successfully',
      serviceRequest
    });

  } catch (error) {
    console.error('Error updating service request:', error);
    res.status(500).json({ 
      message: 'Failed to update service request', 
      error: error.message 
    });
  }
}; 