import React, { useEffect } from 'react';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import GuestHomePg from './WebApplication/GuestPage/guest-home-page/guest-home-pg';
import RegisterPg from './WebApplication/AccountRegister/components/pages/Register-pg';
import Loginpg from './WebApplication/AccountRegister/components/pages/Loginpg';
import ForgotPass from './WebApplication/AccountRegister/components/pages/forgotPage';
import MemeberDashBoardPG from './WebApplication/MemberPage/components/pages/member-dashboard-pg/memberdashboard';
import MemberHomePg from './WebApplication/MemberPage/components/pages/member-home-pg/member-home-pg';
import MemberAuctionPg from './WebApplication/MemberPage/components/pages/member-auction-pg/memberauctionPg';
import JewelryUploadPg from './WebApplication/MemberPage/components/pages/member-jewelry-upload-pg/jewelry-upload-pg';
import MemberJewelryPg from './WebApplication/MemberPage/components/pages/member-Jewelry-pg/member-jewelry-pg';
import MemberViewJewelryPg from './WebApplication/MemberPage/components/pages/member-Jewelry-pg/member-View-Jewelry-Details-Pg';
import ManagerHomePg from './WebApplication/ManagerPage/component/pages/ManagerHomePg';
import MemberAucDetailsPg from './WebApplication/MemberPage/components/pages/member-auction-details-pg/member-auction-details-pg';
import MemberRegisterJewelryAuctionPg from './WebApplication/MemberPage/components/pages/member-register-jewelry-auction/member-register-jewelry-auction-pg';
import MemberJewDetailsPg from './WebApplication/MemberPage/components/pages/member-jewelry-details-pg/member-jewelry-details-pg';
import StaffJewelryPg from './WebApplication/StaffPage/components/pages/staff-view-jewelry/staff-view-jewelry';
import StaffViewJewelryPg from './WebApplication/StaffPage/components/pages/stafff-Jewelry-pg/staff-View-Jewelry-Details-Pg';
import GuestAuctionDetailsPg from './WebApplication/GuestPage/components/guest-auction-details-page/guest-auction-details-pg';
import ProfileStaff from './WebApplication/StaffPage/components/molucules/StaffProfile/ProfileStaff';
import BiddingPG from './WebApplication/MemberPage/components/pages/member-bidding-pg/BiddingPG';
import MemberMyBidsPg from './WebApplication/MemberPage/components/pages/member-my-bids-pg/member-my-bids-pg';
import { useUser } from './WebApplication/Data/UserContext'; // Ensure correct import
import MemberAccountWalletPg from './WebApplication/MemberPage/components/pages/member-account-wallet-pg/member-account-wallet-pg';
import MyWalletPg from './WebApplication/MemberPage/components/pages/member-my-wallet-pg/my-wallet-pg';
import UpdateWalletPg from './WebApplication/MemberPage/components/pages/member-update-wallet-pg/update-wallet-pg';
import AdminPg from './WebApplication/AdminPage/page/AdminPg';
import TableUser from './WebApplication/AdminPage/molecules/Users/TableUser';
import MemberBidsRecordPg from './WebApplication/MemberPage/components/pages/member-bids-record-pg/member-bids-record-pag';
import MemberTransactionPg from './WebApplication/MemberPage/components/pages/member-transaction-pg/member-transaction-pg';
import StaffAuctionsPg from './WebApplication/StaffPage/components/pages/staff-auctions-pg/staff-auctions-pg';
import StaffAuctionDetailsPg from './WebApplication/StaffPage/components/pages/staff-auction-details-pg/staff-auction-details-pg';

const App: React.FC = () => {
  const { user, setUser } = useUser();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('loginedUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  return (
    <>
      <Routes>
        <Route path='/'>
          {user === null ? (
            <>
              <Route index element={<GuestHomePg />} />
              <Route path='/register' element={<RegisterPg />} />
              <Route path='/forgotpass' element={<ForgotPass />} />
              <Route path='/login' element={<Loginpg />} />
              <Route path="/guest-auction/:id" element={<GuestAuctionDetailsPg />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<Loginpg />} />
              {user?.role === 1 && (
                <>
                  <Route index element={<AdminPg />} />
                  <Route path="/adminUser" element={<TableUser />} />
                </>
              )}
              {user?.role === 2 && (
                <>
                  <Route index element={<MemberHomePg />} />
                  <Route path="/mydashboard" element={<MemeberDashBoardPG />} />
                  <Route path="/auction/:id" element={<MemberAucDetailsPg />} />
                  <Route path="/mybidding/:id" element={<BiddingPG />} />
                  <Route path="/jewelry/:id/:material" element={<MemberJewDetailsPg />} />
                  <Route path='/userBid' element={<MemberMyBidsPg />} />
                  <Route path='/userAuc' element={<MemberAuctionPg />} />
                  <Route path='/userJewel/upload' element={<JewelryUploadPg />} />
                  <Route path='/userJewel' element={<MemberJewelryPg />} />
                  <Route path='/ViewJewInfo/:id' element={<MemberJewelryPg />} />
                  <Route path="/update-jewelry/:id/:material" element={<MemberViewJewelryPg />} />
                  <Route path="/register-jewelry-auction/:id/:material" element={<MemberRegisterJewelryAuctionPg />} />
                  <Route path="/register-wallet/:page/:id" element={<MemberAccountWalletPg />} />
                  <Route path="/userWallet" element={<MyWalletPg />} />
                  <Route path="/update-wallet" element={<UpdateWalletPg />} />
                  <Route path="/bids-record" element={<MemberBidsRecordPg />} />
                  <Route path="/userTransaction" element={<MemberTransactionPg />} />
                </>
              )}
              {user?.role === 3 && (
                <>
                  <Route path='/' element={<StaffJewelryPg />} />
                  <Route path="/staff/update-jewelry/:id/:material" element={<StaffViewJewelryPg />} />
                  <Route path="/staffprofile" element={<ProfileStaff />} />
                  <Route path="/staff-auctions" element={<StaffAuctionsPg />} />
                  <Route path="/staff-auction-details/:id" element={<StaffAuctionDetailsPg />} />
                  <Route path="/mybidding/:id" element={<BiddingPG />} />

                </>
              )}
              {user?.role === 5 && (
                <>
                  <Route index element={<ManagerHomePg />} />
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
  <App />
);

export default AppWrapper;
