import MemberHeader from '../../atoms/member-header/member-header'
import MemberHomeTemp from '../../template/member-home/member-home'
import MemberFooter from '../../atoms/member-footer/member-footer'

function MemberHomePg() {
  return (
    <>
    <header>
        <MemberHeader />
    </header>
    <div>
        <MemberHomeTemp />
    </div>
    <footer>
        <MemberFooter />
    </footer>
    </>
  )
}

export default MemberHomePg