import express from 'express';
import { 
  getFlowers,
  getFlowerById,
  createFlower,
  updateFlower,
  deleteFlower,
  getFlowersByCategory 
} from '../controllers/flowerController.ts';
import { validate, validateQueryParams } from '../middleware/validation.ts';
import { flowerSchema, flowerUpdateSchema, paginationSchema } from '../utils/validation.ts';
import { upload } from '../middleware/upload.ts';

const router = express.Router();

// GET all flowers with filtering and sorting
router.get('/', validateQueryParams(paginationSchema), getFlowers);

// GET flowers by category - place this BEFORE the :id route to avoid conflicts
router.get('/category/:category', getFlowersByCategory);

// GET a specific flower
router.get('/:id', getFlowerById);

// POST a new flower
router.post('/', upload.single('image'), validate(flowerSchema), createFlower);

// PATCH an existing flower
router.patch('/:id', upload.single('image'), validate(flowerUpdateSchema), updateFlower);

// DELETE a flower
router.delete('/:id', deleteFlower);

export default router; 