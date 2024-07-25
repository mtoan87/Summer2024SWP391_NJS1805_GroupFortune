import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { MailOutlined, KeyOutlined , SendOutlined} from "@ant-design/icons";
import api from "../../../../../../src/config/axios";
import './forgot.scss';
import '../../../style/forgotPassPg.scss';

const ForgotForm = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleForgotPassword = async () => {
    if (!email) {
      message.error("Vui lòng nhập địa chỉ email.");
      return;
    }

    try {
      const response = await api.post("api/ForgotPassword", { email });
      const data = response.data;
      message.success(data.message);
      setCountdown(60);
      setShowCodeInput(true);
    } catch (error) {
      console.error(error);
      message.error("Gửi mã không thành công. Vui lòng thử lại sau.");
    }
  };

  const handleCodeVerification = async () => {
    if (!code) {
      message.error("Vui lòng nhập mã xác minh.");
      return;
    }

    try {
      const response = await api.post("api/VerifyCode", { email, code });
      const data = response.data;
      if (data.success) {
        message.success("Xác minh thành công!");
        navigate("/reset-password", { state: { email } });
      } else {
        message.error("Mã xác minh không đúng.");
      }
    } catch (error) {
      console.error(error);
      message.error("Xác minh không thành công. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="forgot-body">
      <h1>Input Your Email!</h1>
      <div className="forgot-password-form">
        <div className="input-container">
          <MailOutlined className="input-icon" />
          <input
            type="email"
            id="email"
            placeholder="Fill in email!"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button onClick={handleForgotPassword} disabled={countdown > 0}>
        <SendOutlined style={{ fontSize: '15px', transform: 'rotate(-50deg)' }} /> {countdown > 0 ? `Send (${countdown}s)` :  "Send"} 
        </button>
      </div>
      {showCodeInput && (
        <>
          <h2>Enter the 6-digit code sent to your email</h2>
          <div className="forgot-password-form">
            <div className="input-container">
              <KeyOutlined className="input-icon" />
              <input
                type="text"
                id="code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <button onClick={handleCodeVerification}>  Verify Code</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotForm;
