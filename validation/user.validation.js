import Joi from 'joi';

// User registration validation schema
const userRegisterSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .trim()
    .required()
    .messages({
      'string.base': 'Username should be a type of text',
      'string.empty': 'Username is required',
      'string.min': 'Username should have a minimum length of 3',
      'string.max': 'Username should have a maximum length of 30',
      'any.required': 'Username is required',
    }),
  email: Joi.string()
    .email()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password should have a minimum length of 6',
      'any.required': 'Password is required',
    }),
});

// User login validation schema
const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
});

export { userRegisterSchema, userLoginSchema };
