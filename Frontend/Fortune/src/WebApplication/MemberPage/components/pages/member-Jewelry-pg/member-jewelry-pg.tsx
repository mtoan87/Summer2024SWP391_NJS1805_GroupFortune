import MemberHeader from '../../atoms/member-header/member-header'
import MemberJewelryBody from '../../template/member-jewelry/member-jewelry'
import MemberFooter from '../../atoms/member-footer/member-footer'

function MemberJewelryPg() {
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

export default MemberJewelryPg