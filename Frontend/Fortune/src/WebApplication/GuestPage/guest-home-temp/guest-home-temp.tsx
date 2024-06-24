import Auctions from "../components/organisms/auctions"
import Introduction from "../components/organisms/introduction"
import Jewelry from "../components/organisms/jewelry"
import Rules from "../components/organisms/rules"
import './guest-home-temp.scss'
function GuestHomeTemp() {
  return (
    <><div className="guest-body-container">
      <Introduction />
      <Auctions />
      <Jewelry />
      <Rules />
    </div>
    </>
  )
}

export default GuestHomeTemp