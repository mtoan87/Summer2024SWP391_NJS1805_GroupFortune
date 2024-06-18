import StaffHeader from '../../atoms/staff-header/staff-header'
import StaffViewJewelryBody from '../staff-view-jewelry-details/staff-viewJewelry-Details'
import StaffFooter from '../../atoms/staff-footer/staff-footer'

function StaffViewJewelryPg() {
  return (
    <>
    <header>
        <StaffHeader />
    </header>
    <div>
        <StaffViewJewelryBody />
    </div>
    <footer>
        <StaffFooter />
    </footer>
    </>
  )
}

export default StaffViewJewelryPg