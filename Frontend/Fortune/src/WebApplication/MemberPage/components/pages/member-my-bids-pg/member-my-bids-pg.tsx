import MemberHeader from '../../atoms/member-header/member-header'
import MemberMyBidsTemp from '../../template/member-my-bids/member-my-bids-temp'
import MemberFooter from '../../atoms/member-footer/member-footer'

function MemberMyBidsPg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <MemberMyBidsTemp />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default MemberMyBidsPg