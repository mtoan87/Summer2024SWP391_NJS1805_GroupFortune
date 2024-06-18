import React, { useState } from 'react';
import MemberHeader from './navbar';
import MemberFooter from '../../../atoms/member-footer/member-footer';
import '../styles/mydashboard.scss';
/*-------------------------------------------*/
import Account from './account'
import {
  ProductOutlined,
  PieChartOutlined,
  UserOutlined,
  WalletFilled,
  PayCircleOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import PaymentForm from './payment';

const { Header, Content, Sider } = Layout;

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

const items: MenuItem[] = [
  getItem('DashBoard', '1', <PieChartOutlined />),
  getItem('Account', '2', <UserOutlined />),
  getItem('Payment', 'sub1', <WalletFilled />, [
    getItem('500', '4', <PayCircleOutlined/>),
  ]),
  getItem('My Auction', '5', <ProductOutlined/>),
];

const MyDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e: any) => {
    setCurrentPage(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <MemberHeader />
        </Header>
        <Content style={{ margin: '-10px 0px' }}>
          <Breadcrumb style={{ margin: '50px 0px' }}>
            <Breadcrumb.Item>DashBoard</Breadcrumb.Item>
            {currentPage === '2' && <Breadcrumb.Item>Account</Breadcrumb.Item>}
            {currentPage === '3' && <Breadcrumb.Item>Payment / Wallet</Breadcrumb.Item>}
            {currentPage === '4' && <Breadcrumb.Item>Payment / Point</Breadcrumb.Item>}
            {currentPage === '5' && <Breadcrumb.Item>My Auction</Breadcrumb.Item>}




          </Breadcrumb>

          <div
            style={{
              padding: 20,
              minHeight: 400,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {currentPage === '1' && <div><Account/></div>}
            {currentPage === '2' && <div><Account/></div>}
            {currentPage === '4' && <div><PaymentForm/></div>}


            {/* Add similar conditions for other pages if needed */}
          </div>
        </Content>
        <footer>
          <MemberFooter/>
        </footer>
      </Layout>
    </Layout>
  );
};

export default MyDashboard;
