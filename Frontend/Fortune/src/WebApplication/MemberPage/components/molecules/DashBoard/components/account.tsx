import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../../../../config/axios";
import { useUser } from '../../../../../../WebApplication/Data/UserContext';
import Alert from 'react-bootstrap/Alert';
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/account.scss';  // Đảm bảo rằng bạn đã tạo file stylesheet này để điều chỉnh kiểu dáng tùy chỉnh
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';

const AccountForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user, setUser } = useUser();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const response = await api.put("api/Account/updateAccount", {
        name,
        email,
        password,
        phone
      });
      const data = response.data;
      setUser(data);  // Cập nhật context người dùng
      sessionStorage.setItem("loginedUser", JSON.stringify(data));
      setSuccessMessage("Cập nhật tài khoản thành công!");
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật tài khoản thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div>
      <div className="LoadedMessage">
        {successMessage && (
          <Alert key={'success'} variant={'success'} className="Alert">
            {successMessage}
          </Alert>
        )}
        <h1> Information</h1>
      </div>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          <UserOutlined className="icon" />Name
        </label>
        <input
          type="text"
          id="name"
          className="form-control"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          <MailOutlined className="icon" /> Email
        </label>
        <input
          type="email"
          id="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled // Email không được thay đổi
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          <LockOutlined className="icon" /> Password
        </label>
        <input
          type="password"
          id="password"
          className="form-control"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">
          <PhoneOutlined className="icon" /> Phone
        </label>
        <input
          type="text"
          id="phone"
          className="form-control"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="bt">
        <button type="button" className="btn btn-primary" onClick={handleUpdate}><EditOutlined /> Update Account</button>
      </div>
    </div>
  );
};

export default AccountForm;
