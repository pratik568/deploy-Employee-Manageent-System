import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess, handleError } from "../utils";
import { ToastContainer } from "react-toastify";
import "./Home.css";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    userId: "",
    password: "",
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); // Track admin login status
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    const adminToken = localStorage.getItem("adminToken"); // Check if admin is logged in

    if (user) {
      setLoggedInUser(user);
    } else {
      navigate("/login"); // Redirect to login if no user is logged in
    }

    if (adminToken) {
      setIsAdminLoggedIn(true); // Set admin login state
    } else {
      setShowAdminLogin(true); // Show admin login only if admin is not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("adminToken"); // Clear admin token as well on logout
    handleSuccess("User logged out");
    setIsAdminLoggedIn(false); // Reset admin login state

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminCredentials),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("adminToken", result.token); // Store admin JWT token
        handleSuccess(result.message);
        setShowAdminLogin(false); // Hide admin login after successful login
        setIsAdminLoggedIn(true); // Set admin login state
        navigate("/employeeTable"); // Redirect to the employee table after admin login
      } else {
        handleError(result.message);
      }
    } catch (error) {
      handleError("Error logging in: " + error.message);
    }
  };

  return (
    <div className="main-container">
      <div className="header">
        <h2 className="text">Employee Management System</h2>
        {/* <h2 className='welcome'>Welcome, {loggedInUser}</h2>
            <button onClick={handleLogout}>Logout</button> */}
        <h3>
          {" "}
          Welcome, {loggedInUser}{" "}
          <button onClick={handleLogout}> Logout </button>
        </h3>
      </div>


      <div className="section">
      <h1 className="heading">Employee Management System - Admin Portal</h1>
      <p>
      Welcome to the Admin Portal! As an admin, you have access to manage employee records. 
      You can add new employees, update their details, or delete records as needed.
      </p>
      <p>Admin ID: <b>'admin'</b> & Password:<b>'admin123'</b></p>
      </div>

      {!isAdminLoggedIn && showAdminLogin && (
        <form onSubmit={handleAdminLogin} className="admin-login-form">
          <h2>Admin Login</h2>
          <div>
            <label>Admin ID:</label>
            <input
              type="text"
              value={adminCredentials.userId}
              onChange={(e) =>
                setAdminCredentials({
                  ...adminCredentials,
                  userId: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={adminCredentials.password}
              onChange={(e) =>
                setAdminCredentials({
                  ...adminCredentials,
                  password: e.target.value,
                })
              }
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      )}

      <ToastContainer />
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Employee Management System. All
          Rights Reserved.
        </p>
        <p>Contact: supportt@ems.com | Phone: (123) 456-7890</p>
      </footer>
    </div>
  );
};

export default Home;
