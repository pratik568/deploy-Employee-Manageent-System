const Joi = require('joi');

// Signup Validation
const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Bad request",
            error: error.details[0].message
        });
    }
    next();
};

// Login Validation
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Bad request",
            error: error.details[0].message
        });
    }
    next();
};

// Employee Form Validation
const employeeFormValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        jobTitle: Joi.string().min(3).max(50).required(),
        department: Joi.string().min(2).max(50).required(),
        salary: Joi.number().min(0).required(), // Ensuring salary is a number
        hireDate: Joi.string().required(), // Ensuring hireDate is a valid ISO date
        contactInformation: Joi.string().min(5).max(100).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Bad request",
            error: error.details[0].message
        });
    }
    next();
};

// Admin Login Validation
const adminLoginValidation = (req, res, next) => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Bad request",
            error: error.details[0].message
        });
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation,
    employeeFormValidation,
    adminLoginValidation,
};
