import React, { useState } from 'react';
import Sidebar from '../../atoms/Admin-sidebar/AdminSideBar';
import AdminFooter from '../../atoms/Admin-footer/admin-footer';
import MainContent from '../Maincontent/Maincontent';
import TableUser from '../Users/TableUser';
import './Admins.scss';
import ProfileAdmin from '../Admin-Profile/AdminProfile';

function Admins() {
  const [currentPage, setCurrentPage] = useState('dashboard'); 

  const handleMenuClick = (key) => {
    setCurrentPage(key); 
  };

  return (
    <>
      <div className="body-page">
        <Sidebar onMenuClick={handleMenuClick} /> 
        <div className="main-content">
          {currentPage === 'dashboard' && <MainContent />}
          {currentPage === 'users' && <TableUser />}
          {currentPage === 'about' && <ProfileAdmin />}
        </div>
      </div>
      <footer className='footer-page'>
        <AdminFooter />
      </footer>
    </>
  );
}

export default Admins;
