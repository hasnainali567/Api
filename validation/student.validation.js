import Joi from "joi";

const studentRegisterSchema = Joi.object({
    firstName: Joi.string().required().trim().messages({
        'string.empty': 'First name is required',
        'string.pattern.base': 'First name must be a string',
    }),
    lastName: Joi.string().required().trim().messages({
        'string.empty': 'Last name is required',
        'string.pattern.base': 'Last name must be a string',
    }),
    email: Joi.string().email().required().trim().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email address',
    }),
    phone: Joi.string().pattern(/^\d{10,15}$/).required().trim().messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Phone number must be 10 to 15 digits',
    }),
    profilePic: Joi.string().optional().trim(),
    gender: Joi.string().required().trim().messages({
        'string.empty': 'Gender is required',
        'string.pattern.base': 'Gender must be a string',
    }),
})


const studentUpdateSchema = Joi.object({
    firstName: Joi.string().optional().trim(),
    lastName: Joi.string().optional().trim(),
    email: Joi.string().email().optional().trim(),
    phone: Joi.string().pattern(/^\d{10,15}$/).optional().trim(),
    profilePic: Joi.string().optional().trim(),
    gender: Joi.string().optional().trim(),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

export { studentRegisterSchema, studentUpdateSchema }