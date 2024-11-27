const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Normalize email to lowercase
    },
    password: {
        type: String,
        required: true,
    },
});

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Normalize email to lowercase
    },
    jobTitle: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    salary: {
        type: Number, // Changed from String to Number for consistency
        required: true,
    },
    hireDate: {
        type: String, // Changed from String to Date for better date handling
        required: true,
    },
    contactInformation: {
        type: String,
        required: true,
    },
});

const AdminSchema = new Schema({
    userID: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const UserModel = mongoose.model('User', UserSchema);
const EmployeeModel = mongoose.model('Employee', EmployeeSchema);
const AdminModel = mongoose.model('Admin', AdminSchema);

module.exports = { UserModel, EmployeeModel, AdminModel };
