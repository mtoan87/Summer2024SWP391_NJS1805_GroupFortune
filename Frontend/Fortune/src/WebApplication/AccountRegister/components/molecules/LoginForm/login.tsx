import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../../../../src/config/axios";
import '../../authGeneral.scss';
import './login.scss';
import { useUser } from '../../../../../WebApplication/Data/UserContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập địa chỉ email và mật khẩu.");
      return;
    }

    try {
      const response = await api.post("api/Login/login", {
        email: email,
        password: password
      });
      const data = response.data;
      setUser(data);  // Update user context
      sessionStorage.setItem("loginedUser", JSON.stringify(data));
      navigate('/');
    } catch (error) {
      console.log(error);~
      toast.error("Login failed. Try again!");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  useEffect(() => {
    const userString = sessionStorage.getItem("loginedUser");
    const user = userString ? JSON.parse(userString) : null;
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="login-form">
      <form onSubmit={handleLogin}>
        <div className="rectangle-border">
          <div className="inputField">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="on"
            />
          </div>
          <div className="inputField">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="login-buttons">
          <button type="submit">Sign in</button>
          <button type="button" onClick={handleRegister}>
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
