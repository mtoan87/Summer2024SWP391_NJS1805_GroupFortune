import StaffFooter from "../../atoms/staff-footer/staff-footer"
import StaffHeader from "../../atoms/staff-header/staff-header"
import StaffAuctionDetailsTmp from "../../template/staff-auction-details/staff-auction-details"


function StaffAuctionDetailsPg() {
  return (
    <>
    <header>
        <StaffHeader />
    </header>
    <div>
        <StaffAuctionDetailsTmp />
    </div>
    <footer>
        <StaffFooter />
    </footer>
    </>
  )
}

export default StaffAuctionDetailsPg