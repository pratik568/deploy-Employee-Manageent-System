const express = require('express');
const {
    signup,
    login,
    employeeForm,
    updateEmployee,
    getAllEmployees,
    deleteEmployee,
    adminLogin
} = require('../Controllers/AuthController');
const ensureAuthenticated = require('../Middlewares/Auth').ensureAuthenticated;
const {
    signupValidation,
    loginValidation,
    employeeFormValidation,
    adminLoginValidation
} = require('../Middlewares/AuthValidation');

const router = express.Router();

// User signup route: Creates a new user
router.post('/signup', signupValidation, signup);

// User login route: Authenticates a user
router.post('/login', loginValidation, login);

// Employee form submission route: Requires authentication to submit employee data
router.post('/employeeForm', ensureAuthenticated, employeeFormValidation, employeeForm);

// Route to fetch all employees: Requires authentication
router.get('/employees', ensureAuthenticated, getAllEmployees);

// Route to delete an employee: Requires authentication
router.delete('/employee/:id', ensureAuthenticated, deleteEmployee);

// Route to update an employee: Requires authentication
router.put('/employee/:id', ensureAuthenticated, employeeFormValidation, updateEmployee); // Added validation to updateEmployee route

// Admin login route: Authenticates admin user (no authentication needed for this)
router.post('/admin/login', adminLoginValidation, adminLogin);

module.exports = router;
