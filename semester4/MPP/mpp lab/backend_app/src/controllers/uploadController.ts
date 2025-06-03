import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middleware/errorHandler.ts';
import { getFileUrl } from '../middleware/upload.ts';

// @desc    Upload a file (image or video)
// @route   POST /api/upload
// @access  Public
export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new ApiError('No file uploaded', 400);
    }
    
    // Get the file URL
    const fileUrl = getFileUrl(req, req.file.filename);
    
    res.status(201).json({
      success: true,
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Public
export const uploadMultipleFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      throw new ApiError('No files uploaded', 400);
    }
    
    const files = Array.isArray(req.files) 
      ? req.files 
      : Object.values(req.files).flat();
    
    // Get URLs for all files
    const filesData = files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: getFileUrl(req, file.filename)
    }));
    
    res.status(201).json({
      success: true,
      count: filesData.length,
      data: filesData
    });
  } catch (error) {
    next(error);
  }
}; 