import GuestHeader from '../guest-header'
import GuestAuctionDetailsTemp from '../guest-auction-details-temp/guest-auction-detail-temp'
import GuestFooter from '../guest-footer'

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