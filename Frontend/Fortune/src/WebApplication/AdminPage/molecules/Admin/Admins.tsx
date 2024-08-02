import React, { useState } from 'react';
import Sidebar from '../../atoms/Admin-sidebar/AdminSideBar';
import AdminFooter from '../../atoms/Admin-footer/admin-footer';
import MainContent from '../Maincontent/Maincontent';
import TableUser from '../Users/TableUser';
import './Admins.scss';
import ProfileAdmin from '../Admin-Profile/AdminProfile';
import TableAuctionAdmin from '../Auction/AuctionAdmin';
import TableBiddings from '../Biddings/BiddingList';
import TablePayment from '../Payment/PaymentList';
import TableTransact from '../transactions/transacList';

function Admins() {
  const [currentPage, setCurrentPage] = useState('overall'); 

  const handleMenuClick = (key) => {
    setCurrentPage(key); 
  };

  return (
    <>
      <div className="body-page">
        <Sidebar onMenuClick={handleMenuClick} /> 
        <div className="main-content">
          {currentPage === 'overall' && <MainContent />}
          {currentPage === 'users' && <TableUser />}
          {currentPage === 'about' && <ProfileAdmin />}
          {currentPage === 'auctions' && <TableAuctionAdmin />}
          {currentPage === 'biddings' && <TableBiddings />}
          {currentPage === 'payments' && <TablePayment />}
          {currentPage === 'transactions' && <TableTransact />}
        </div>
      </div>
      <footer className='footer-page'>
        <AdminFooter />
      </footer>
    </>
  );
}

export default Admins;
