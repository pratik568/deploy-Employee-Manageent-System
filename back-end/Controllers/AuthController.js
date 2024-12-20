const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel, EmployeeModel } = require("../Models/User");
require('dotenv').config();


// Signup route
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Signup request received for:", email);

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists. You can log in.",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            message: "Signup successful",
            success: true,
        });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// Login route
const login = async (req, res) => {
    console.log("inlogin");
    try {
        console.log("intry");
        const { email, password } = req.body;
        console.log("Login request received for:", email);

        const user = await UserModel.findOne({ email });
        console.log(user);
        if (!user) {
            console.error("User not found:", email);
            return res.status(403).json({ message: "Invalid email or password", success: false });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log("hii" ,isPasswordCorrect);
        if (!isPasswordCorrect) {
            console.error("Incorrect password for:", email);
            return res.status(403).json({ message: "Invalid email or password", success: false });
        }
        console.log(process.env.JWT_SECRET);
        const jwtToken = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        console.log(jwtToken);
        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name,
        });
    } catch (err) {
        console.log(process.env.JWT_SECRET);
        console.log(process.env.MONGO_CONN);
        console.error("Login error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// Employee creation route
const employeeForm = async (req, res) => {
    try {
        const { name, email, jobTitle, department, salary, hireDate, contactInformation } = req.body;

        if (!name || !email || !jobTitle || !department || !salary || !hireDate || !contactInformation) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        const existingEmployee = await EmployeeModel.findOne({ email });
        if (existingEmployee) {
            return res.status(409).json({
                message: "An employee with this email address already exists.",
                success: false,
            });
        }

        const newEmployee = new EmployeeModel({ name, email, jobTitle, department, salary, hireDate, contactInformation });
        await newEmployee.save();

        res.status(201).json({
            message: "Employee created successfully",
            success: true,
            employee: newEmployee,
        });
    } catch (err) {
        console.error("Employee creation error:", err.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// Fetch all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        res.status(200).json({ success: true, employees });
    } catch (error) {
        console.error("Error fetching employees:", error.message);
        res.status(500).json({ success: false, message: "Server error, please try again later." });
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const deletedEmployee = await EmployeeModel.findByIdAndDelete(employeeId);
        if (deletedEmployee) {
            return res.status(200).json({
                success: true,
                message: "Employee deleted successfully",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }
    } catch (err) {
        console.error("Error deleting employee:", err.message);
        res.status(500).json({ success: false, message: "Error deleting employee" });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, jobTitle, department, salary, hireDate, contactInformation } = req.body;

        const employee = await EmployeeModel.findByIdAndUpdate(id, {
            name, email, jobTitle, department, salary, hireDate, contactInformation
        }, { new: true });

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        res.json({ success: true, message: "Employee updated successfully", employee });
    } catch (error) {
        console.error("Error updating employee:", error.message);
        res.status(500).json({ success: false, message: "Error updating employee" });
    }
};

// Admin login route
const adminLogin = async (req, res) => {
    const { userId, password } = req.body;
    if (userId === 'admin' && password === 'admin123') {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ success: true, message: 'Admin logged in successfully', token });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
};

// Middleware to protect admin routes
const ensureAdminAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ success: false, message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || decoded.role !== 'admin') {
            console.error("Token verification error:", err);
            return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
        }
        req.userId = decoded._id;
        next();
    });
};

// Admin logout (handled on frontend)
const adminLogout = (req, res) => {
    return res.json({ success: true, message: "Admin logged out successfully" });
};

// Exporting all functions
module.exports = {
    signup,
    login,
    employeeForm,
    updateEmployee,
    getAllEmployees,
    deleteEmployee,
    adminLogin,
    adminLogout
};
