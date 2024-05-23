import './App.scss'
import GuestHomePg from './WebApplication/GuestPage/components/pages/guest-home-pg/guest-home-pg/guest-home-pg'
import RegisterPg from './WebApplication/AccountRegister/components/pages/Register-pg'
import { Route, Routes } from 'react-router-dom';
import Loginpg from './WebApplication/AccountRegister/components/pages/Loginpg';

function App() {
const storedUser = sessionStorage.getItem("loginedUser");
console.log(storedUser);
const user = storedUser ? JSON.parse(storedUser) : null;
  return (
    <>
      <Routes>
        <Route path='/'>
          {
            user === null ? ( 
              <>
                <Route index element={<GuestHomePg />} />
                <Route path='register' element={<RegisterPg />} />
                <Route path='login' element={<Loginpg />} />
              </>
            ) : ( 
              <>
               <Route path='/login' element={<Loginpg />} />
                {user.roleId === 1 && (
                    <> 
                    </>
                  )}
                  {user.roleId === 2 && (
                    <>
                    </>
                  )}
                  {user.roleId === 3 && (
                    <>
                      
                    </>
                  )}
                  {user.roleId === 4 && (
                    <>
                    
                    </>
                  )}
              </>
            )
          }
        </Route>
      </Routes>
    </>
  )
}

export default App;
