import './bids-record.scss'

function MemberBidsRecord() {

    const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
  const accountId = loginedUser?.accountId;

  return (
    <div>MemberBidsRecord</div>
  )
}

export default MemberBidsRecord