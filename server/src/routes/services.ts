import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Service from '../models/Service';
import auth from '../middleware/auth';

const router = express.Router();

// Get all services
router.get('/', async (_req: Request, res: Response) => {
  try {
    const services = await Service.find().populate('provider', ['firstName', 'lastName', 'email']);
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a service
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('price', 'Price is required').isNumeric(),
      check('location', 'Location is required').not().isEmpty(),
    ],
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, category, price, location } = req.body;

      const service = new Service({
        title,
        description,
        provider: req.user.id,
        category,
        price,
        location,
      });

      await service.save();
      res.json(service);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// Update a service
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    // Make sure user owns the service
    if (service.provider.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { title, description, category, price, availability, location } = req.body;

    if (title) service.title = title;
    if (description) service.description = description;
    if (category) service.category = category;
    if (price) service.price = price;
    if (availability !== undefined) service.availability = availability;
    if (location) service.location = location;

    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a service
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    // Make sure user owns the service
    if (service.provider.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await service.deleteOne();
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router; 