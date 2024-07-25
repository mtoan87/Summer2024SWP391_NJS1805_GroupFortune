import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../../../../src/config/axios";
import "react-toastify/dist/ReactToastify.css";
import './forgot.scss';
import '../../authGeneral.scss';

const VerifyCodeForm = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error("Vui lòng nhập mã xác minh.");
      return;
    }

    try {
      const response = await api.post("api/VerifyCode", { email, verificationCode });
      const data = response.data;
      toast.success(data.message);
      navigate("/reset-password");
    } catch (error) {
      console.error(error);
      toast.error("Xác minh mã không thành công. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Xác minh mã!</h2>
      <label htmlFor="verificationCode">Nhập mã xác minh</label>
      <input
        type="text"
        id="verificationCode"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleVerifyCode}>Xác minh</button>
      <p>Mã sẽ hết hạn trong: {countdown} giây</p>
    </div>
  );
};

export default VerifyCodeForm;
