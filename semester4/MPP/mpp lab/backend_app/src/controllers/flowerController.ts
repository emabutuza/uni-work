import type { Request, Response, NextFunction } from 'express';
import Flower from '../models/Flower.ts';
import type { IFlower } from '../models/Flower.ts';
import { ApiError } from '../middleware/errorHandler.ts';
import { getFileUrl } from '../middleware/upload.ts';

// @desc    Get all flowers with filtering and sorting
// @route   GET /api/flowers
// @access  Public
export const getFlowers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = {};
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.event) {
      filter.event = req.query.event;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice as string);
      }
      
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice as string);
      }
    }
    
    // Search by name
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    let sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort = { [sortField]: sortOrder };
    } else {
      sort = { createdAt: -1 }; // Default sort by newest
    }
    
    // Count total documents for pagination
    const total = await Flower.countDocuments(filter);
    
    // Get paginated flowers
    const flowers = await Flower.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    res.json({
      success: true,
      count: flowers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: flowers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single flower by ID
// @route   GET /api/flowers/:id
// @access  Public
export const getFlowerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flower = await Flower.findById(req.params.id);
    
    if (!flower) {
      throw new ApiError(`Flower not found with id ${req.params.id}`, 404);
    }
    
    res.json({
      success: true,
      data: flower
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new flower
// @route   POST /api/flowers
// @access  Public
export const createFlower = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Handle file upload if provided
    if (req.file) {
      req.body.imageUrl = getFileUrl(req, req.file.filename);
    }
    
    const flower = await Flower.create(req.body);
    
    res.status(201).json({
      success: true,
      data: flower
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a flower
// @route   PATCH /api/flowers/:id
// @access  Public
export const updateFlower = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Handle file upload if provided
    if (req.file) {
      req.body.imageUrl = getFileUrl(req, req.file.filename);
    }
    
    const flower = await Flower.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!flower) {
      throw new ApiError(`Flower not found with id ${req.params.id}`, 404);
    }
    
    res.json({
      success: true,
      data: flower
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a flower
// @route   DELETE /api/flowers/:id
// @access  Public
export const deleteFlower = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flower = await Flower.findByIdAndDelete(req.params.id);
    
    if (!flower) {
      throw new ApiError(`Flower not found with id ${req.params.id}`, 404);
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get flowers by category
// @route   GET /api/flowers/category/:category
// @access  Public
export const getFlowersByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flowers = await Flower.find({ category: req.params.category });
    
    res.json({
      success: true,
      count: flowers.length,
      data: flowers
    });
  } catch (error) {
    next(error);
  }
}; 