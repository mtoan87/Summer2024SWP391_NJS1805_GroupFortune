import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../../../../src/config/axios";
import "react-toastify/dist/ReactToastify.css";
import './forgot.scss'
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
      // Xử lý khi mã đã được gửi thành công
      toast.success(data.message);
      // Chuyển hướng người dùng đến trang thông báo gửi mã thành công
      navigate("/forgot-password-success");
    } catch (error) {
      console.error(error);
      toast.error("Gửi mã không thành công. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Lấy lại mật khẩu!</h2>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Gửi mã</button>
    </div>
  );
};

export default ForgotForm;
