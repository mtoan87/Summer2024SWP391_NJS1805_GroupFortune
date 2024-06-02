import MemberViewAuctions from "../../molecules/auctions/memberAuction"
import MemberIntroduction from '../../molecules/introduction/introduction'
function memberAuctionBody() {
  return (
    <div> 
    <MemberIntroduction />
    <MemberViewAuctions/>
    </div>
  )
}

export default memberAuctionBody