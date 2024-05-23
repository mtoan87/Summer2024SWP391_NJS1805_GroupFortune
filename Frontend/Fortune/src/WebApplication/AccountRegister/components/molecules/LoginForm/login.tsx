import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../../../../src/config/axios";
import '../../authGeneral.scss'
import './login.scss'

const LoginForm: React.FC = () => {
    // Retrieve the item from sessionStorage
    const storedUser = sessionStorage.getItem("loginedUser");

    // Check if the retrieved item is not null before parsing
    const user = storedUser ? JSON.parse(storedUser) : null;
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Vui lòng nhập địa chỉ email và mật khẩu.");
            return;
        }

        try {
            const response = await api.post("Login/login", {
                email: email,
                password: password
            });
            const data = response;

            /*
                 tra du lieu:
                    payload: {
                        data: nhung data lien quan den object duoc tra
                        message: thong bao di kem
                        status: trang thai goi du lieu
                    }
            */

            console.log(data);
        } catch (error) {
            console.log(error);
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
