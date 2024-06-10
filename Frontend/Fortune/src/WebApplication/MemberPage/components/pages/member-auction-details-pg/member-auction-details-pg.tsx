import MemberHeader from '../../atoms/member-header/member-header'
import MemberAuctionDetailsTemp from '../../template/member-auction-details/member-auction-details'
import MemberFooter from '../../atoms/member-footer/member-footer'

function MemberAucDetailsPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <MemberAuctionDetailsTemp />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default MemberAucDetailsPg