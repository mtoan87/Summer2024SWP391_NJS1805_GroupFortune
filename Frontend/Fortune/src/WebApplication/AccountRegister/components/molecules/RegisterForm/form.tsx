import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { FaFacebookF, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import '../../../style/registerPg.scss';
import './form.scss'
import api from '../../../../../config/axios';

function BasicExample() {
  const [messageText, setMessageText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await api.post('api/Login/register', values);

      if (response.status === 200) {
        message.success('Account created successfully!');
        navigate('/login');
      } else {
        message.error('Failed to create account. Please check your inputs.');
      }

      console.log('Response:', response);
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to create account. Please check your inputs.');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="form-container">
      <Form
        name="basic"
        onFinish={handleSubmit}
      >
        <h1 className="form-title">Sign Up</h1> {/* Tiêu đề của form */}

        <Form.Item
          name="accountName"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="accountEmail"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} type="email" placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="accountPassword"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="accountPhone"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number" />
        </Form.Item>

        <Form.Item>
          <Button className="Summitbt" type="primary" htmlType="submit">
            Register
          </Button>
          <span className="re-login-link"><a onClick={handleLogin}>Yes, I have an account! Login</a></span>
          <div className="re-social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaWhatsapp /></a>
            <a href="#"><FaTelegram /></a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default BasicExample;
