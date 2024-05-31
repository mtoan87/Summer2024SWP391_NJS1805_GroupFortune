import Auctions from "../../molecules/auctions/auctions"
import Introduction from "../../molecules/introduction/introduction"
import Jewelry from "../../molecules/jewelries/jewelry"
import Rules from "../../molecules/rules/rules"

function GuestHomeTemp() {
  return (
    <>
      <Introduction />
      <Auctions />
      <Jewelry />
      <Rules />
    </>
  )
}

export default GuestHomeTemp