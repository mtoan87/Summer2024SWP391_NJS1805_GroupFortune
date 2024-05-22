import './App.scss'
import GuestHomePg from './WebApplication/GuestPage/components/pages/guest-home-pg/guest-home-pg/guest-home-pg'
import RegisterPg from './WebApplication/AccountRegister/components/pages/Register-pg'
import { Route, Routes } from 'react-router-dom';
function App() {
  const user = sessionStorage.getItem('loginedUser') ? JSON.parse(sessionStorage.getItem('loginedUser')) : null;
  const member = sessionStorage.getItem('loginedMember') ? JSON.parse(sessionStorage.getItem('loginedMember')) : null;
  return (
    <>
       {
        <Routes>
          <Route path='/'>
            {
              user === null ? (
                <>
                  <Route index element={<GuestHomePg />} />
                  <Route path='register' element={<RegisterPg />} />
                </>
              ) : (
                <>
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
      }
    </>
  )
}

export default App
