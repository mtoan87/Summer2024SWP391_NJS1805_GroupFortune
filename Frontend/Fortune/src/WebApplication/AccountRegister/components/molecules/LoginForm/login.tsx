import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../../../../src/config/axios";
import './login.scss';
import { useUser } from '../../../../../WebApplication/Data/UserContext';
import Alert from 'react-bootstrap/Alert';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebookF, FaWhatsapp, FaTelegram } from 'react-icons/fa';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('successMessage');
    if (message) {
      setSuccessMessage(message);
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  useEffect(() => {
    const userString = sessionStorage.getItem("loginedUser");
    const user = userString ? JSON.parse(userString) : null;
    if (user) {
      checkAccountWallet(user.accountId);
    }
  }, []);

  const checkAccountWallet = async (accountId: number) => {
    try {
      const response = await api.get(`/AccountWallet/GetAccountWalletByAccountId/${accountId}`);
      const accountWalletInfo = response.data;
      if (accountWalletInfo) {
        navigate('/');
      } else {
        navigate('/register-wallet');
      }
    } catch (error) {
      console.error('Error checking account wallet:', error);
      toast.error("Failed to check account wallet. Please try again later!");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email address and password.");
      return;
    }

    try {
      const response = await api.post("api/Login/login", {
        accountEmail: email,
        accountPassword: password
      });
      const data = response.data;
      setUser(data);
      sessionStorage.setItem("loginedUser", JSON.stringify(data));
      checkAccountWallet(data.accountId); // Check account wallet after successful login
    } catch (error) {
      console.error('Login failed:', error);
      toast.error("Login failed. Please try again!");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleForgot = () => {
    navigate("/forgotpass");
  };

  return (
    <div className="login-form">
      <div className="LoadedMessage">
        {successMessage && (
          <Alert key={'success'} variant={'success'} className="Alert">
            {successMessage}
          </Alert>
        )}
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
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
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="on"
          />
        </div>
        <button type="submit">Login</button>
        <span className="register-link"><a onClick={handleRegister}>Don't have an account? Register</a></span>
        <span className="forgot-link"><a onClick={handleForgot}> Forgot your password? Reset Password</a></span>
        <div className="social-icons">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaWhatsapp /></a>
          <a href="#"><FaTelegram /></a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
