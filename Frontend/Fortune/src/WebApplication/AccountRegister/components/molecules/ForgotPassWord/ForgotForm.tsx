import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../../../../src/config/axios";
import "react-toastify/dist/ReactToastify.css";
import './forgot.scss';
import '../../authGeneral.scss';

const ForgotForm = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email.");
      return;
    }

    try {
      const response = await api.post("api/ForgotPassword", { email });
      const data = response.data;
      toast.success(data.message);
      navigate("/verify-code", { state: { email } });
    } catch (error) {
      console.error(error);
      toast.error("Gửi mã không thành công. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Reset Password</h2>
      <label htmlFor="email">Fill in email !</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Send</button>
    </div>
  );
};

export default ForgotForm;
