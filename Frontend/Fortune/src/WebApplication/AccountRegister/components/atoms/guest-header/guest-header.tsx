import React from 'react';
import { Link } from 'react-router-dom';
import './guest-header.scss';
import logo from '../../../../../../src/assets/img/logo2.png';
import account from '../../../../../../src/assets/img/account.png';

const GuestHeader: React.FC = () => {
  return (
    <div className="guest-header-home">
      <nav>
        <ul>
          <div className="guest-header-items">
            <img src={logo} alt="logo" className='logo' />
          </div>
          <div className="guest-header-items">
            <li className="inline-block">HOME</li>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">AUCTIONS</li>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">RULES</li>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">ABOUT US</li>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              <Link to='/register'>
                <img src={account} alt="account" className='account' />
              </Link>
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default GuestHeader;
