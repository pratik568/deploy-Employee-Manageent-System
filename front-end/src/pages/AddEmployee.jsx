import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import './AddEmployee.css';
import { ToastContainer } from 'react-toastify';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [employeeInfo, setEmployeeInfo] = useState({
        name: '',
        email: '',
        jobTitle: '',
        department: '',
        salary: '',
        hireDate: '',
        contactInformation: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeInfo({ ...employeeInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleError('No token found. Please log in again.');
                return navigate('/login'); // Redirect to login if token is missing
            }

            const url = "http://localhost:8080/auth/employeeForm";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include 'Bearer' before the token
                },
                body: JSON.stringify(employeeInfo),
            });

            const result = await response.json();

            if (response.status === 409) {
                handleError('An employee with this email address already exists.');
            } else if (response.ok) { // Check if the response is successful
                handleSuccess('Employee added successfully!');
                setTimeout(() => {
                    navigate('/employeeTable');
                }, 1000);
            } else {
                handleError(result.message || 'Failed to add employee');
            }
        } catch (err) {
            handleError('Error adding employee: ' + err.message);
        }
    };

    return (
        <div className="add-employee-container">
            <h1>Add Employee</h1>
            <form onSubmit={handleSubmit} className="add-employee-form">
                <div className="form-field">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={employeeInfo.name}
                        onChange={handleChange}
                        placeholder="Enter employee name"
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={employeeInfo.email}
                        onChange={handleChange}
                        placeholder="Enter employee email"
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="jobTitle">Job Title:</label>
                    <select
                        name="jobTitle"
                        value={employeeInfo.jobTitle}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select job title</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="HR Manager">HR Manager</option>
                        <option value="Sales Associate">Sales Associate</option>
                        <option value="Marketing Specialist">Marketing Specialist</option>
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor="department">Department:</label>
                    <select
                        name="department"
                        value={employeeInfo.department}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Sales">Sales</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor="salary">Salary:</label>
                    <input
                        type="number" // Change type to number
                        name="salary"
                        value={employeeInfo.salary}
                        onChange={handleChange}
                        placeholder="Enter salary"
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="hireDate">Hire Date:</label>
                    <input
                        type="text"
                        name="hireDate"
                        value={employeeInfo.hireDate}
                        onChange={handleChange}
                        placeholder='DD-MM-YYYY'
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="contactInformation">Contact Information:</label>
                    <input
                        type="text"
                        name="contactInformation"
                        value={employeeInfo.contactInformation}
                        onChange={handleChange}
                        placeholder="Enter contact information"
                        required
                    />
                </div>
                <button type="submit" className="add-employee-button">Add Employee</button>
            </form>

            <button type="button" className="cancel-button" onClick={() => navigate('/employeeTable')}>
  Cancel
</button>

            <ToastContainer />
        </div>
    );
};

export default AddEmployee;
