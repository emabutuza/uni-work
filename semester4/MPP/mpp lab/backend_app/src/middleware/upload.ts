import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';
import { ApiError } from './errorHandler.ts';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (_req: Request, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req: Request, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept image files and videos
  if (
    file.mimetype.startsWith('image/') || 
    file.mimetype.startsWith('video/')
  ) {
    cb(null, true);
  } else {
    cb(new ApiError('Only image and video files are allowed!', 400) as unknown as Error);
  }
};

// Export multer middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  }
});

// Helper to get the file URL
export const getFileUrl = (req: Request, filename: string): string => {
  return `${req.protocol}://${req.get('host')}/${process.env.UPLOAD_DIR || 'uploads'}/${filename}`;
}; 