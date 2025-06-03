import Joi from 'joi';

export const flowerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
      'any.required': 'Name is required'
    }),
  
  price: Joi.number().min(0).required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required'
    }),
  
  description: Joi.string().trim().min(10).max(1000).required()
    .messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must be at least {#limit} characters long',
      'string.max': 'Description cannot exceed {#limit} characters',
      'any.required': 'Description is required'
    }),
  
  category: Joi.string().trim().required()
    .messages({
      'string.base': 'Category must be a string',
      'string.empty': 'Category cannot be empty',
      'any.required': 'Category is required'
    }),
  
  brand: Joi.string().trim().required()
    .messages({
      'string.base': 'Brand must be a string',
      'string.empty': 'Brand cannot be empty',
      'any.required': 'Brand is required'
    }),
  
  event: Joi.string().valid('Wedding', 'Anniversaries', 'Holidays', 'Other').required()
    .messages({
      'string.base': 'Event must be a string',
      'any.only': 'Event must be one of: Wedding, Anniversaries, Holidays, Other',
      'any.required': 'Event is required'
    }),
  
  imageUrl: Joi.string().required()
    .messages({
      'string.base': 'Image URL must be a string',
      'string.empty': 'Image URL cannot be empty',
      'any.required': 'Image URL is required'
    })
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number().integer().min(1).max(100).default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    })
});

export const flowerUpdateSchema = flowerSchema.fork(
  ['name', 'price', 'description', 'category', 'brand', 'event', 'imageUrl'], 
  (schema) => schema.optional()
).min(1).messages({
  'object.min': 'At least one field must be provided for update'
}); 