import React, { useEffect } from 'react';
import './App.scss';
import GuestHomePg from './WebApplication/GuestPage/components/pages/guest-home-pg/guest-home-pg/guest-home-pg';
import RegisterPg from './WebApplication/AccountRegister/components/pages/Register-pg';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Loginpg from './WebApplication/AccountRegister/components/pages/Loginpg';
import MemberHomePg from './WebApplication/MemberPage/components/pages/member-home-pg/member-home-pg';
import { UserProvider, useUser } from './WebApplication/Data/UserContext';
import MemberAuctionPg from './WebApplication/MemberPage/components/pages/member-auction-pg/memberauctionPg';
const App: React.FC = () => {
  const { user, setUser } = useUser();
  useEffect(() => {
    const storedUser = sessionStorage.getItem("loginedUser");
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
              <Route path='register' element={<RegisterPg />} />
              <Route path='login' element={<Loginpg />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<Loginpg />} />
              {user.role === 1 && (
                <>
                  {/* Add your admin routes here */}
                </>
              )}
              {user.role === 2 && (
                <>
                  <Route index element={<MemberHomePg />} />
                  <Route path='/user' element={<MemberHomePg />} />
                  <Route index element={<MemberAuctionPg />} />
                  <Route path='/userAuc' element={<MemberAuctionPg />} />
                </>
              )}
              {user.role === 3 && (
                <>
                  {/* Add your staff routes here */}
                </>
              )}
              {user.role === 4 && (
                <>
                  {/* Add your manager routes here */}
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
