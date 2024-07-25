import MemberHeader from '../../atoms/member-header/member-header'
import MemberViewJewelryBody from '../../template/member-jewelry/member-view-jewelry-details/member-viewJewelry-Details'
import MemberFooter from '../../atoms/member-footer/member-footer'

function MemberViewJewelryPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <MemberViewJewelryBody />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default MemberViewJewelryPg