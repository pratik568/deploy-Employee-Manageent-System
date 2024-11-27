import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "./Login.css";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("email and password are required");
    }
    try {
      const url = "https://deploy-employee-manageent-system.vercel.app/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/home");
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
    <div className="main-container">
      

      <div className="section">
      <h1 className="heading">Welcome to the Employee Management System!</h1>
      <p>
      Please enter your credentials to access your account. If you are an admin, you can manage 
      employee records, including adding, editing, and deleting employee details.
      </p>
      <p><b>Don't have an account? You can register by clicking the 'Sign Up' button below.</b></p>
      </div>
      

      <div className="login-container">
        <div className="login-content">
          <h1 className="login-h1">Login</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="div-login-elements">
              <label htmlFor="email">Email:</label>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Enter your email..."
                value={loginInfo.email}
              />
            </div>
            <div className="div-login-elements">
              <label htmlFor="password">Password:</label>
              <input
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Enter your password..."
                value={loginInfo.password}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            <span>
              Don't have an account ?<Link to="/signup">Signup</Link>
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

export default Login;
