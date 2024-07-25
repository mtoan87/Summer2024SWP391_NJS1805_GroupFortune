import MemberFooter from '../../atoms/member-footer/member-footer'
import MemberHeader from '../../atoms/member-header/member-header'
import MemberDashBoardTemplate from '../../template/memeber-dashboard/memberdashboardtmp'

function MemberDashBoardPg() {
  return (
    <>
      <header>
        <MemberHeader />
      </header>
      <div>
        <MemberDashBoardTemplate />
      </div>
      <footer>
        <MemberFooter />
      </footer>
    </>
  )
}

export default MemberDashBoardPg