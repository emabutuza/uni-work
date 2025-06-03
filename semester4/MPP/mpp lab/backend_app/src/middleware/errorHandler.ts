import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Custom error class
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found error handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Global error handler
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Server Error';

  // Handle specific error types
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(error.errors)
      .map(err => err.message)
      .join(', ');
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
  } else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 400;
    const keyValue = (error as any).keyValue;
    const keys = Object.keys(keyValue).join(', ');
    message = `Duplicate field value entered for ${keys}`;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
}; 