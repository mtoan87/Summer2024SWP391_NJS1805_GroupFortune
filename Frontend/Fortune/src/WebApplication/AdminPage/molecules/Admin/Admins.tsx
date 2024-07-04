import AdminHeader from '../../atoms/Admin-header/admin-header'
import Sidebar from '../../atoms/Admin-sidebar/AdminSideBar'
import AdminFooter from '../../atoms/Admin-footer/admin-footer'

function Admins() {
  return (
    <>
    {/* <header className='header-page'>
        <AdminHeader/>
    </header> */}
    <body className='body-page'>
        <Sidebar/>

    </body>
    <footer className='footer-page'>
        <AdminFooter/>
    </footer>
    </>
  )
}

export default Admins
