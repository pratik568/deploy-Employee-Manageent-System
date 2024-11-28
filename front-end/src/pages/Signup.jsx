import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "./Signup.css";

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("name, email and password are required");
    }
    try {
      const url = "https://deploy-employee-manageent-system-i3zf.vercel.app/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div>

      <div className="section">
      <h1 className="heading" >Employee Management System - Sign Up</h1>
      {/* <p>
        Sign up to access our Employee Management System and start managing
        employee records.
      </p> */}
      <p>
      Create your account to get started with the Employee Management System. 
      Please fill in your details and choose a secure password. After registering, 
      you'll be able to log in and manage your employee records if you are an admin
      </p>
      </div>

      <div className="signup-container">
        <div className="signup-content">
          <h1 className="signup-h1">Signup</h1>
          <form onSubmit={handleSignup} className="signup-form">
            <div className="div-signup-element">
              <label htmlFor="name">Name:</label>
              <input
                onChange={handleChange}
                type="text"
                name="name"
                autoFocus
                placeholder="Enter your name..."
                value={signupInfo.name}
              />
            </div>
            <div className="div-signup-element">
              <label htmlFor="email">Email:</label>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Enter your email..."
                value={signupInfo.email}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Enter your password..."
                value={signupInfo.password}
              />
            </div>
            <button type="submit" className="signup-button">
              SignUp
            </button>
            <span>
              Already have an account ?<Link to="/login">Login</Link>
            </span>
          </form>
          <ToastContainer />
        </div>
      </div>
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

export default Signup;
