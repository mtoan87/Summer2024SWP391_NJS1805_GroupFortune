import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, EditOutlined } from '@ant-design/icons';
import { message } from 'antd';
import api from "../../../../../config/axios";
import { useUser } from '../../../../Data/UserContext';
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './ProfileStaff.scss';  // Đảm bảo bạn đã tạo stylesheet này cho các style tùy chỉnh
import StaffFooter from "../../atoms/staff-footer/staff-footer";
import StaffHeader from "../../atoms/staff-header/staff-header";

const ProfileStaff: React.FC = () => {
  const [AccountName, setName] = useState<string>("");
  const [AccountEmail, setEmail] = useState<string>("");
  const [AccountPassword, setPassword] = useState<string>("");
  const [AccountPhone, setPhone] = useState<string>("");
  const [OldPassword, setOldPassword] = useState<string>("");
  const { user, setUser } = useUser();
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser ? loginedUser.accountId : null;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const accountResponse = await api.get(`/Account/GetById/${accountId}`);
      const accountData = accountResponse.data;

      if (accountData.accountPassword !== OldPassword) {
        message.error("Old password is incorrect!");
        return;
      }

      const response = await api.put(`/Account/updateAccount?id=${accountId}`, {
        AccountName,
        AccountEmail,
        AccountPassword,
        AccountPhone
      });

      const data = response.data;
      const loginedUser = {
        "$id": data.$id,
        "accountId": data.accountId,
        "email": data.accountEmail,
        "phone": data.accountPhone,
        "name": data.accountName,
        "role": data.roleId
      };
      setUser(loginedUser);  // Update user context
      sessionStorage.setItem("loginedUser", JSON.stringify(loginedUser));
      message.success("Account updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update account. Try again!");
    }
  };

  return (
    <>
      <header>
        <StaffHeader />
      </header>
      <div className="profile-staff">
        <h1>INFORMATION</h1>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <UserOutlined /> Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Name"
            value={AccountName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <MailOutlined /> Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Email"
            value={AccountEmail}
            onChange={(e) => setEmail(e.target.value)}
            disabled // Email shouldn't be changed
          />
        </div>
        <div className="form-group">
          <label htmlFor="old-password" className="form-label">
            <LockOutlined /> Old Password
          </label>
          <input
            type="password"
            id="old-password"
            className="form-control"
            placeholder="Old Password"
            value={OldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            <LockOutlined /> New Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="New Password"
            value={AccountPassword}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            <PhoneOutlined /> Phone
          </label>
          <input
            type="text"
            id="phone"
            className="form-control"
            placeholder="Phone"
            value={AccountPhone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="bt">
          <button type="button" className="btn btn-primary" onClick={handleUpdate}>
            <EditOutlined /> Update Account
          </button>
        </div>
      </div>
      <footer>
        <StaffFooter />
      </footer>
    </>
  );
};

export default ProfileStaff;
