


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel, EmployeeModel } = require("../Models/User");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
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
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", success: false });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h", issuer: 'EMS' }
    );

    // Send success response
    res.status(200).json({
      message: "Login successful",
      success: true,
      token: jwtToken,
      user: { email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


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
      console.error(err);
      res.status(500).json({ message: "Internal Server Error: " + err.message, success: false });
  }
};


const getAllEmployees = async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        return res.status(200).json({ success: true, employees });
    } catch (error) {
        console.error("Error fetching employees:", error);
        return res.status(500).json({ success: false, message: "Server error, please try again later." });
    }
};

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
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error deleting employee: " + err.message,
        });
    }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, jobTitle, department, salary, hireDate, contactInformation } = req.body;

  try {
      const employee = await EmployeeModel.findByIdAndUpdate(id, {
          name, email, jobTitle, department, salary, hireDate, contactInformation
      }, { new: true });

      if (!employee) {
          return res.status(404).json({ success: false, message: "Employee not found" });
      }

      res.json({ success: true, message: "Employee updated successfully", employee });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
  }
};


const adminLogin = async (req, res) => {
    const { userId, password } = req.body;
    
    // Admin credentials hardcoded for this example; change as needed
    if (userId === 'admin' && password === 'admin123') {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ success: true, message: 'Admin logged in successfully', token });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
};

// Protect these routes
const ensureAdminAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ success: false, message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
        }
        req.userId = decoded._id; // Attach user ID to request for further use
        next();
    });
};


const adminLogout = (req, res) => {
  // Since logout is done on frontend by clearing the token, 
  // we can just respond to confirm the logout process
  return res.json({ success: true, message: "Admin logged out successfully" });
};

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

