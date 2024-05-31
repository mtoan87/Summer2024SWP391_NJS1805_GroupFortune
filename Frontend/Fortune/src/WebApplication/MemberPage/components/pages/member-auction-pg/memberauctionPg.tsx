import MemberHeader from '../../atoms/member-header/member-header'
import MemberAuction from '../../template/member-auction/member-auction'
import MemberFooter from '../../atoms/member-footer/member-footer'

function MemberAuctionPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <MemberAuction />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default MemberAuctionPg