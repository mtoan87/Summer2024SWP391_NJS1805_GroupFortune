import React, { useState } from 'react';
import { Menu } from 'antd';
import { UserOutlined, LogoutOutlined, UsergroupAddOutlined, DashboardOutlined, InfoCircleOutlined, ProductOutlined, RubyOutlined, FundOutlined, WalletOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import './AdminSidebar.scss'; 
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../Data/UserContext'; 

const Sidebar: React.FC<{ onMenuClick: (e: any) => void }> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("loginedUser");
    navigate('/');
    window.location.reload();
  };

  const items: MenuProps['items'] = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard',
         children: [
      { key: 'overall', label: 'Overall', icon: <FundOutlined /> },
      { key: 'auctions', icon: <ProductOutlined />, label: 'Auctions' },
      { key: 'users', icon: <UsergroupAddOutlined />, label: 'Users' },
      { key: 'biddings', icon: <UsergroupAddOutlined />, label: 'Bidding' },
      { key: 'payments', icon: <WalletOutlined />, label: 'Payments' },
      { key: 'transactions', icon: <WalletOutlined />, label: 'Transactions' },
    ],},
    {
      key: 'account',
      icon: <UserOutlined />,
      label: `Hello, ${user?.name}`,
      children: [
        { key: 'about', label: 'About', icon: <InfoCircleOutlined /> },
        { key: 'logout', label: 'Log Out', icon: <LogoutOutlined /> },
      ],
    },
  ];

  const handleMenuClick = (e: any) => {
    if (e.key === 'logout') {
      handleLogout();
    } else {
      onMenuClick(e.key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250} 
      collapsedWidth={80} 
      className="sider"
      style={{ height: '200vh' }} 
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        defaultSelectedKeys={['dashboard']}
        mode="inline"
        onClick={handleMenuClick}
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
