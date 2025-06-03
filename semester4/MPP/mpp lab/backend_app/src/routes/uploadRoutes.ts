import express from 'express';
import { uploadFile, uploadMultipleFiles } from '../controllers/uploadController.ts';
import { upload } from '../middleware/upload.ts';

const router = express.Router();

// Upload a single file
router.post('/', upload.single('file'), uploadFile);

// Upload multiple files
router.post('/multiple', upload.array('files', 10), uploadMultipleFiles);

export default router; 