import React, { useEffect, useState } from 'react';
import { Table, Space, Typography, Button,Input } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined ,ReloadOutlined } from '@ant-design/icons';
import api from '../../../../config/axios';
import './tableuser.scss'; // Import SCSS file

const { Text } = Typography;
const { Search } = Input;
const TableUser = () => {
  const [userData, setUserData] = useState([]);
  const [showPasswords, setShowPasswords] = useState({});
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/Account/GetAllAccount');
      console.log('Fetched data:', response.data);
      const formattedData = response.data.$values.map(user => ({
        accountId: user.accountId,
        accountName: user.accountName,
        accountEmail: user.accountEmail,
        accountPassword: user.accountPassword,
        accountPhone: user.accountPhone,
        roleId: user.roleId,
      }));
      setUserData(formattedData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  // search function 
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = userData.filter(user => {
    return (
      user.accountName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.accountEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      user.accountPhone.toLowerCase().includes(searchText.toLowerCase())
    );
  });
  const handleReload = () => {
    fetchUserData();
    setSearchText(''); // Reset search text
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'accountId',
      key: 'accountId',
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Name',
      dataIndex: 'accountName',
      key: 'accountName',
      render: (text) => <Text className="table-text" strong>{text}</Text>,
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Email',
      dataIndex: 'accountEmail',
      key: 'accountEmail',
      render: (text) => (
        <Space className="table-space">
          <MailOutlined />
          <Text className="table-text">{text}</Text>
        </Space>
      ),
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Password',
      dataIndex: 'accountPassword',
      key: 'accountPassword',
      render: (text, record) => (
        <Space className="table-space">
          <LockOutlined />
          <Text className={`table-text ${showPasswords[record.accountId] ? 'visible' : 'hidden'}`}>
            {showPasswords[record.accountId] ? text : 'Hidden'}
          </Text>
          <Button className="toggle-button" onClick={() => togglePasswordVisibility(record.accountId)}>
            {showPasswords[record.accountId] ? 'Hide' : 'Show'}
          </Button>
        </Space>
      ),
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Phone',
      dataIndex: 'accountPhone',
      key: 'accountPhone',
      render: (text) => (
        <Space className="table-space">
          <PhoneOutlined />
          <Text className="table-text">{text}</Text>
        </Space>
      ),
      align: 'center',
      className: 'table-column',
    },
    {
      title: 'Role',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (role) => {
        let roleLabel = '';
        switch (role) {
          case 1:
            roleLabel = 'Admin';
            break;
          case 2:
            roleLabel = 'Staff';
            break;
          case 3:
            roleLabel = 'Manager';
            break;
          default:
            roleLabel = 'User';
        }
        return (
          <Space className="table-space">
            <UserOutlined /> {/* Default icon */}
            <Text className="table-text">{roleLabel}</Text>
          </Space>
        );
      },
      align: 'center',
      className: 'table-column',
    },
  ];

  return (
    <>
    <div className="table-container">
      <h1>Active Users</h1>
      <Button onClick={handleReload} className="reload" icon={<ReloadOutlined />} />
      <Search placeholder="Search users..." onSearch={handleSearch} style={{ marginBottom: 10  }} className="search-bar"/>
      <Table columns={columns} dataSource={filteredData} rowKey="accountId" pagination={{ pageSize: 15 }} />
    </div>
    </>
  );
};

export default TableUser;
