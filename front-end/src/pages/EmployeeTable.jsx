import React, { useEffect, useState } from "react";
import "./EmployeeTable.css";
import { handleError, handleSuccess } from "../utils";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeTable = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobTitle: "",
    department: "",
    salary: "",
    hireDate: "",
    contactInformation: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ jobTitle: "", department: "" });

  // Fetch employees from the server
  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://deploy-employee-manageent-system.vercel.app/auth/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setEmployees(data.employees);
        } else {
          handleError(data.message);
        }
      } catch (err) {
        handleError("Error fetching employees: " + err.message);
      }
    };
    fetchEmployees();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/auth/employee/${editingEmployee._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            jobTitle: formData.jobTitle,
            department: formData.department,
            salary: parseFloat(formData.salary), // Ensure salary is a number
            hireDate: formData.hireDate,
            contactInformation: formData.contactInformation,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        handleSuccess("Employee updated successfully!");
        setEmployees((prev) =>
          prev.map((emp) =>
            emp._id === editingEmployee._id ? result.employee : emp
          )
        );
        setEditingEmployee(null);
      } else {
        handleError(result.message || "Failed to update employee");
      }
    } catch (err) {
      handleError("Error updating employee: " + err.message);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/auth/employee/${employeeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          handleSuccess("Employee deleted successfully!");
          setEmployees((prev) =>
            prev.filter((employee) => employee._id !== employeeId)
          );
        } else {
          handleError(result.message);
        }
      } catch (err) {
        handleError("Error deleting employee: " + err.message);
      }
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.jobTitle === "" || employee.jobTitle === filters.jobTitle) &&
      (filters.department === "" || employee.department === filters.department)
    );
  });

  const handleAdminLogout = async () => {
    try {
      localStorage.removeItem("adminToken"); // Clear the admin token
      handleSuccess("Logged out successfully");
      navigate("/home"); // Redirect to the home page (or login page if you prefer)
    } catch (error) {
      handleError("Failed to log out");
    }
  };

  return (

    <div>
    <div className="header">
            <h2 className="text">Employee Management System</h2>
            <button onClick={handleAdminLogout} className="logout-btn">
            AdminLogout
        </button>
        </div>
        <div className="employee-table-container">
        
        <h1>Employee List</h1>


        
        <div className="search-filter-container">
            <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            />



            <div className="filters">
            <select
                name="jobTitle"
                value={filters.jobTitle}
                onChange={handleFilterChange}
            >
                <option value="">Filter by Job Title</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Sales Associate">Sales Associate</option>
                <option value="Marketing Specialist">Marketing Specialist</option>
            </select>

            <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
            >
                <option value="">Filter by Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
            </select>
            </div>
        </div>

        
        <table className="employee-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Hire Date</th>
                <th>Contact Information</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.jobTitle}</td>
                <td>{employee.department}</td>
                <td>{employee.salary}</td>
                <td>{employee.hireDate}</td>
                <td>{employee.contactInformation}</td>
                <td>
                    <button onClick={() => handleEdit(employee)}>Edit</button>
                    <button onClick={() => handleDelete(employee._id)}>
                    Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        {editingEmployee && (
            <form onSubmit={handleUpdate} className="update-employee-form">
            <h2>Edit Employee</h2>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="contactInformation"
                value={formData.contactInformation}
                onChange={handleChange}
                required
            />
            <button type="submit">Update Employee</button>
            <button type="button" onClick={() => setEditingEmployee(null)}>
                Cancel
            </button>
            </form>
        )}
        <button
            onClick={() => navigate("/addEmployee")}
            className="add-employee-btn">
            Add Employee
        </button>
        
        
        <ToastContainer />
        
        </div>
        </div>
  );
};

export default EmployeeTable;
