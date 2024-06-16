import MemberAuctions from '../../molecules/auctions/member-auctions'
import MemberJewelry from '../../molecules/jewelries/member-jewelry'
import MemberIntroduction from '../../molecules/introduction/introduction'
import MemberRules from '../../molecules/rules/rules'

function MemberHomeTemp() {
  return (
    <>
    <MemberIntroduction />
    <MemberAuctions />
    <MemberJewelry />
    <MemberRules />
    </>
  )
}

export default MemberHomeTemp