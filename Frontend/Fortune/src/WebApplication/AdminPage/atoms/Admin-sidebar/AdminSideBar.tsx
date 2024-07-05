import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { UserOutlined, LogoutOutlined, UsergroupAddOutlined, DashboardOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import './AdminSidebar.scss'; 
import api from '../../../../config/axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../Data/UserContext'; 

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const Sidebar: React.FC<{ onMenuClick: (e: any) => void }> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    
    api.get('/api/user')
      .then(response => {
        setUser(response.data); 
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [setUser]);

  const handleLogout = () => {
    sessionStorage.removeItem("loginedUser");
    navigate('/');
    window.location.reload();
  };

  const items: MenuItem[] = [
    getItem('Dashboard', '1', <DashboardOutlined />),
    getItem('Users', '2', <UsergroupAddOutlined />),

    getItem('Account', 'sub2', <UserOutlined />, [
      getItem(`Hello, ${user?.name}`, '8'),
      getItem('About', '6', <InfoCircleOutlined />),
      getItem('Log Out', '7', <LogoutOutlined />),
    ]),
  ];

  const handleMenuClick = (e: any) => {
    if (e.key === '7') {
      handleLogout();
    } else {
      onMenuClick(e);
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
      style={{ height: '150vh' }} 
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
