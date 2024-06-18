import MemberHeader from '../../atoms/staff-header/staff-header'
import MemberJewelryBody from '../../template/staff-jewelry/staff-jewelry'
import MemberFooter from '../../atoms/staff-footer/staff-footer'

function StaffJewelryPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <MemberJewelryBody />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default StaffJewelryPg