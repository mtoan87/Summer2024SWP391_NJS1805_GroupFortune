import Sidebar from '../../atoms/Admin-sidebar/AdminSideBar'
import AdminFooter from '../../atoms/Admin-footer/admin-footer'
import MainContent from '../Maincontent/Maincontent'
import './Admins.scss'
function Admins() {
  return (
    <>
      <div className="body-page">
        <Sidebar />
        <MainContent />
      </div>
    <footer className='footer-page'>
        <AdminFooter/>
    </footer>
    </>
  )
}

export default Admins
