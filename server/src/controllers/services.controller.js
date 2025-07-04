const Service = require('../models/services.model');

// Add a new service
exports.addService = async (req, res) => {
  try {
    const { name, description, imgUrl } = req.body;
    if (!name || !description || !imgUrl) {
      return res.status(400).json({ message: 'Name, description, and imgUrl are required.' });
    }
    const newService = new Service({ name, description, imgUrl });
    await newService.save();
    res.status(201).json({ message: 'Service created successfully', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
};

// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({}, 'name description imgUrl');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
}; 