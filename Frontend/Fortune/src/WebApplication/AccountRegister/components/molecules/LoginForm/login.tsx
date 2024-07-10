import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message, Input, Button } from "antd";
import api from "../../../../../../src/config/axios";
import "./login.scss";
import { useUser } from "../../../../../WebApplication/Data/UserContext";
import { MailOutlined, LockOutlined, FacebookOutlined, WhatsAppOutlined, SendOutlined } from "@ant-design/icons";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const successMessage = params.get("successMessage");
    if (successMessage) {
      message.success(successMessage);
    }
  }, [location.search]);

  useEffect(() => {
    const userString = sessionStorage.getItem("loginedUser");
    const user = userString ? JSON.parse(userString) : null;
    // if (user && user.role_id === 2) {
    //   checkAccountWallet(user.accountId);
    // }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      message.error("Please enter your email address and password.");
      return;
    }

    try {
      const response = await api.post("api/Login/login", {
        accountEmail: email,
        accountPassword: password,
      });
      const data = response.data;
      setUser(data);
      sessionStorage.setItem("loginedUser", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      message.error("Login failed. Please try again!");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleForgot = () => {
    navigate("/forgotpass");
  };

  return (
      <form className="login-form" onSubmit={handleLogin}>
        <div className="mb-3">
        <h1>Welcome</h1>

          <label htmlFor="email" className="form-label">
          <MailOutlined /> Email
          </label>
          <Input
            type="email"
            id="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="on"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
          <LockOutlined /> Password
          </label>
          <Input
            type="password"
            id="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="on"
          />
        </div>
        <Button type="primary" htmlType="submit" className="btn btn-primary">
          Login
        </Button>
        <span className="register-link">
          <a onClick={handleRegister}>Don't have an account? Register</a>
        </span>
        <span className="forgot-link">
          <a onClick={handleForgot}> Forgot your password? Reset Password</a>
        </span>
        <div className="social-icons">
          <a href="#">
            <FacebookOutlined />
          </a>
          <a href="#">
            <WhatsAppOutlined />
          </a>
          <a href="#">
            <SendOutlined />
          </a>
        </div>
      </form>
    
  );
};

export default LoginForm;
