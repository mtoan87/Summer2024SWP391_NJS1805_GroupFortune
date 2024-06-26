import React, { useState } from 'react';
import { Menu } from 'antd';
import { UserOutlined, LogoutOutlined, AppstoreOutlined, CrownOutlined, InfoCircleOutlined, RubyOutlined, GoldOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import '../manager-SideBar/Sidebar.scss';
import { useNavigate } from 'react-router-dom';

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
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("loginedUser");
    navigate('/');
    window.location.reload();
  };

  const items: MenuItem[] = [
    getItem('Manage Auctions', '1', <CrownOutlined />),
    getItem('Manage Jewelry', 'sub1', <AppstoreOutlined />, [
      getItem('All', '2', <CrownOutlined />),
      getItem('Gold', '3', <GoldOutlined />),
      getItem('Silver', '4', <GoldOutlined />),
      getItem('Gold Diamond', '5', <RubyOutlined />),
    ]),
    getItem('Account', 'sub2', <UserOutlined />, [
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
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} className="sider">
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
