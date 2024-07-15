import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import MemberFooter from '../../component/atoms/member-footer/member-footer';
import AuctionManageScreen from '../template/AuctionManageScreen';
import Sidebar from '../atoms/manager-SideBar/SideBar'; // Adjust the import path based on your project structure
import './ManagerHomePg.scss';
import JewelryManageScreen from '../template/JewelryManageScreen';
import GoldManageScreen from '../template/GoldManageScreen';
import SilverManageScreen from '../template/SilverManageScreen';
import GoldDiaManageScreen from '../template/GoldDIaManageScreen';
import ManagerProfileScreen from '../template/ManagerProfileScreen';

const { Header, Content } = Layout;

const ManagerHomePg: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e: any) => {
    setCurrentPage(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar onMenuClick={handleMenuClick} />
      <Layout>
        <Content style={{ margin: '-10px 0px' }}>
          <div
            style={{
              padding: 20,
              minHeight: 400,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {currentPage === '1' && <AuctionManageScreen />}
            {currentPage === '2' && <JewelryManageScreen />}
            {currentPage === '3' && <GoldManageScreen />}
            {currentPage === '4' && <SilverManageScreen />}
            {currentPage === '5' && <GoldDiaManageScreen />}
            {currentPage === '6' && <ManagerProfileScreen />}
            {/* Add conditions for other pages if needed */}
          </div>
        </Content>
        <footer>
          <MemberFooter />
        </footer>
      </Layout>
    </Layout>
  );
};

export default ManagerHomePg;
