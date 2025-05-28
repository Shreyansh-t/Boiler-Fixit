const express = require('express');
const router = express.Router();

// GET all services
router.get('/', (req, res) => {
  // This is a placeholder. In a real app, this would fetch from a database
  const services = [
    { id: 1, title: 'Plumbing Repairs', description: 'Fix leaks, unclog drains, and more' },
    { id: 2, title: 'Bicycle Maintenance', description: 'Tune-ups, repairs, and parts replacement' },
    { id: 3, title: 'Electronics Repair', description: 'Computer, phone, and device repairs' },
    { id: 4, title: 'Furniture Assembly', description: 'Assembly and repair of furniture' }
  ];
  res.json(services);
});

// GET service by ID
router.get('/:id', (req, res) => {
  // Placeholder for getting a specific service
  res.json({ message: `Get service with ID ${req.params.id}` });
});

// POST new service
router.post('/', (req, res) => {
  // Placeholder for creating a new service
  res.json({ message: 'Create new service' });
});

module.exports = router; 