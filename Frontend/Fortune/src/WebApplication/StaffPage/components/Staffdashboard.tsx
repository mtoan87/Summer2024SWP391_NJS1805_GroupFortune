import React, { useState } from 'react';
import { LaptopOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useUser } from '../../Data/UserContext';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const headerItems: MenuProps['items'] = [
    { key: '1', label: 'Home' },
    { key: '2', label: 'Jewelry' },
];

const Staffdashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      setUser(null);
      sessionStorage.removeItem("loginedUser");
      navigate('/login');
    } else {
      setCurrentPage(e.key);
    }
  };

  const sidebarItems: MenuProps['items'] = [
    {
      key: 'sub1',
      icon: React.createElement(UserOutlined),
      label: 'Account',
      children: [
        { key: '2', label: `Name: ${user?.name || 'Guest'}` },
        { key: '3', label: 'Profile' },
      ],
    },
    {
      key: 'sub2',
      icon: React.createElement(LaptopOutlined),
      label: 'Jewelry',
      children: [
        { key: '4', label: 'Regist jewelry'},
      ],
    },
  ];

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={headerItems}
          style={{ flex: 1, minWidth: 0 }}
        />
        {user && (
          <Menu
            theme="dark"
            mode="horizontal"
            onClick={handleMenuClick}
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: <span style={{ fontSize: '16px' }}>Logout</span>,
              },
            ]}
          />
        )}
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '120%', borderRight: 0 }}
            items={sidebarItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '50px 0px' }}>
            <Breadcrumb.Item>DashBoard</Breadcrumb.Item>
            {currentPage === '2' && <Breadcrumb.Item>Account</Breadcrumb.Item>}
            {currentPage === '3' && <Breadcrumb.Item>Account / Profile</Breadcrumb.Item>}
            {currentPage === '4' && <Breadcrumb.Item>Jewelry</Breadcrumb.Item>}
            </Breadcrumb>
          <Content
            style={{
              padding: 25,
              margin: 0,
              minHeight: 700,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Staffdashboard;
