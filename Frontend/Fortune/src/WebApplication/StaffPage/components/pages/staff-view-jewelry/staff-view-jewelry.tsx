import MemberHeader from '../../atoms/member-header/member-header'
import MemberJewelryBody from '../../template/staff-jewelry/member-jewelry'
import MemberFooter from '../../atoms/member-footer/member-footer'

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