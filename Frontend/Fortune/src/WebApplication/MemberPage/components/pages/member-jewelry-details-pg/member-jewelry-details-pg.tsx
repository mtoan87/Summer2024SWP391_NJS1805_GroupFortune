import MemberHeader from '../../atoms/member-header/member-header'
import MemberJewelryDetailsTemp from '../../template/member-jewelry-details/member-jewelry-details'
import MemberFooter from '../../atoms/member-footer/member-footer'

function MemberJewDetailsPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <MemberJewelryDetailsTemp />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default MemberJewDetailsPg