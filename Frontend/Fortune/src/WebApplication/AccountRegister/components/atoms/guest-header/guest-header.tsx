import './guest-header.scss'

function GuestHeader() {
  return (
    <div className="guest-header-home">
      <nav>
        <ul>
          <div className="guest-header-items">
            <img src="../../../../../../src/assets/img/logo2.png" alt="logo.png" className='logo' />
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              HOME
            </li>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              AUCTIONS
            </li>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              RULES
            </li>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              ABOUT US
            </li>
          </div>
          <div className="guest-header-items">
            <img src="../../../../../../src/assets/img/account.png" alt="logo.png" className='account' />
          </div>
        </ul>
      </nav>
    </div>
  )
}

export default GuestHeader