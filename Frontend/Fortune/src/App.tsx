import React, { useEffect, useState } from 'react';
import './App.scss';
/*-------------------------------AUTHENTICAL----------------------------------------------*/
import GuestHomePg from './WebApplication/GuestPage/guest-home-page/guest-home-pg';
import RegisterPg from './WebApplication/AccountRegister/components/pages/Register-pg';
import { Route, Routes } from 'react-router-dom';
import Loginpg from './WebApplication/AccountRegister/components/pages/Loginpg';
import ForgotPass from './WebApplication/AccountRegister/components/pages/forgotPage';

/*--------------------------MEMBER----------------------------------------------*/
import MemeberDashBoardPG from './WebApplication/MemberPage/components/pages/member-dashboard-pg/memberdashboard';
import MemberHomePg from './WebApplication/MemberPage/components/pages/member-home-pg/member-home-pg';
import { UserProvider, useUser } from './WebApplication/Data/UserContext';
import MemberAuctionPg from './WebApplication/MemberPage/components/pages/member-auction-pg/memberauctionPg';
import JewelryUploadPg from './WebApplication/MemberPage/components/pages/member-jewelry-upload-pg/jewelry-upload-pg';
import MemberJewelryPg from './WebApplication/MemberPage/components/pages/member-Jewelry-pg/member-jewelry-pg';
import MemberViewJewelryPg from './WebApplication/MemberPage/components/pages/member-Jewelry-pg/member-View-Jewelry-Details-Pg';
import ManagerHomePg from './WebApplication/ManagerPage/component/pages/ManagerHomePg';
import MemberAucDetailsPg from './WebApplication/MemberPage/components/pages/member-auction-details-pg/member-auction-details-pg';
import MemberRegisterJewelryAuctionPg from './WebApplication/MemberPage/components/pages/member-register-jewelry-auction/member-register-jewelry-auction-pg';
import MemberJewDetailsPg from './WebApplication/MemberPage/components/pages/member-jewelry-details-pg/member-jewelry-details-pg';
import StaffJewelryPg from './WebApplication/StaffPage/components/pages/staff-view-jewelry/staff-view-jewelry';
import StaffViewJewelry from './WebApplication/StaffPage/components/molucules/jewelry-details/staffViewJewelry';
import StaffViewJewelryPg from './WebApplication/StaffPage/components/pages/stafff-Jewelry-pg/staff-View-Jewelry-Details-Pg';
import GuestAuctionDetailsPg from './WebApplication/GuestPage/components/guest-auction-details-page/guest-auction-details-pg';
import ProfileStaff from './WebApplication/StaffPage/components/molucules/StaffProfile/ProfileStaff';
import BiddingPG from './WebApplication/MemberPage/components/pages/member-bidding-pg/BiddingPG';
import MemberMyBidsPg from './WebApplication/MemberPage/components/pages/member-my-bids-pg/member-my-bids-pg';
import AdminPg from './WebApplication/AdminPage/page/AdminPg';
import { Bounce, ToastContainer } from 'react-toastify';

import WebSocketClient from './config/websocketClient'; // Import WebSocketClient

import TableUser from './WebApplication/AdminPage/molecules/Users/TableUser';
const App: React.FC = () => {
  const { user, setUser } = useUser();
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("loginedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    console.log(storedUser);
    // const client = new WebSocketClient('wss://localhost:44361/ws'); // Initialize WebSocket
    // setWsClient(client);

    // return () => {
    //   client.sendMessage('Client disconnected.');
    // };
  }, [setUser]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        className='toast-content'
        transition={Bounce} />
      <Routes>
        <Route path='/'>
          {user === null ? (
            <>
              <Route index element={<GuestHomePg />} />
              <Route path='register' element={<RegisterPg />} />
              <Route path='forgotpass' element={<ForgotPass />} />
              <Route path='login' element={<Loginpg />} />
              <Route path="/guest-auction/:id" element={<GuestAuctionDetailsPg />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<Loginpg />} />
              {user.role === 1 && (
                <>
                  <Route index element={<AdminPg />} />
                 <Route index element={<AdminPg/>} />
                 <Route path="/adminUser" element ={<TableUser/>} />

                </>
              )}
              {user.role === 2 && (
                <>
                  <Route index element={<MemberHomePg />} />
                  <Route path="/mydashboard" element={<MemeberDashBoardPG />} />
                  <Route path="/auction/:id" element={<MemberAucDetailsPg />} />
                  <Route path="/mybidding/:id" element={<BiddingPG />} />
                  <Route path="/jewelry/:id" element={<MemberJewDetailsPg />} />
                  <Route path='/userBid' element={<MemberMyBidsPg />} />
                  <Route path='/userAuc' element={<MemberAuctionPg />} />
                  <Route path='/userJewel/upload' element={<JewelryUploadPg />} />
                  <Route path='/userJewel' element={<MemberJewelryPg />} />
                  <Route path='/ViewJewInfo/:id' element={<MemberJewelryPg />} />
                  {/* <Route path='/userJewel/:id' element={<MemberJewelryPg />} /> */}
                  <Route path="/update-jewelry/:id/:material" element={<MemberViewJewelryPg />} />
                  <Route path="/register-jewelry-auction/:id/:material" element={<MemberRegisterJewelryAuctionPg />} />
                </>
              )}
              {user.role === 3 && (
                <>
                  <Route path='/' element={<StaffJewelryPg />} />
                  <Route path="/staff/update-jewelry/:id/:material" element={<StaffViewJewelryPg />} />
                  <Route path='/staffprofile' element={<ProfileStaff />} />
                  {/* Add your staff routes here */}
                </>
              )}
              {user.role === 5 && (
                <>
                  {/* Add your manager routes here */}
                  <Route index element={<ManagerHomePg />} />
                  <Route path='/managerA&DJew' element={<ProfileStaff />} />
                </>
              )}
            </>
          )}
        </Route>
      </Routes>
    </>
  );
};

const AppWrapper: React.FC = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default AppWrapper;
