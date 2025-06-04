import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      res.status(400).json({ 
        success: false, 
        message: 'Validation error', 
        errors: errorMessage 
      });
      return;
    }
    
    next();
  };
};

export const validateQueryParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      res.status(400).json({ 
        success: false, 
        message: 'Query parameter validation error', 
        errors: errorMessage 
      });
      return;
    }
    
    // Update the query parameters with validated values
    req.query = value;
    next();
  };
}; 