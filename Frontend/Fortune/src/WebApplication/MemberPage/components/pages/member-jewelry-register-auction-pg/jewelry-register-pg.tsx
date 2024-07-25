import MemberHeader from '../../atoms/member-header/member-header'
import RegisterJewelryForAuctionTemp from '../../template/member-register-jewel-auction/register-jewelry-auction-tmp'
import MemberFooter from '../../atoms/member-footer/member-footer'

function JewelryRegisterAuctionPage() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div className="boy-container">
        <RegisterJewelryForAuctionTemp />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default JewelryRegisterAuctionPage