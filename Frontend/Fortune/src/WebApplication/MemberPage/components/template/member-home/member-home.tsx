import MemberAuctions from '../../molecules/auctions/auctions'
import MemberJewelry from '../../molecules/jewelries/jewelry'
import MemberIntroduction from '../../molecules/introduction/introduction'

function MemberHomeTemp() {
  return (
    <>
    <MemberIntroduction />
    <MemberAuctions />
    <MemberJewelry />
    </>
  )
}

export default MemberHomeTemp