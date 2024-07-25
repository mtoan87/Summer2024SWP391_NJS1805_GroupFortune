import GuestHeader from '../organisms/guest-header'
import GuestAuctionDetailsTemp from '../guest-auction-details-temp/guest-auction-detail-temp'
import GuestFooter from '../organisms/guest-footer'

function GuestAuctionDetailsPg() {
  return (
    <>
    <header>
        <GuestHeader />
    </header>
    <div>
        <GuestAuctionDetailsTemp />
    </div>
    <footer>
        <GuestFooter />
    </footer>
    </>
  )
}

export default GuestAuctionDetailsPg