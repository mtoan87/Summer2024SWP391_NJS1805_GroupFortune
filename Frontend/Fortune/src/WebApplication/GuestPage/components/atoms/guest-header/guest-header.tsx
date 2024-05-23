import React from 'react';
import { Link as Forward } from 'react-router-dom';
import './guest-header.scss';
import logo from '../../../../../../src/assets/img/logo2.png';
import account from '../../../../../../src/assets/img/account.png';
import { Link } from 'react-scroll'

const GuestHeader: React.FC = () => {
  return (
    <div className="guest-header-home">
      <nav>
        <ul>
          <div className="guest-header-items">
            <img src={logo} alt="logo" className='logo' />
          </div>
          <div className="guest-header-items">
            <Link to='guest-introduction'>
              <li className="inline-block">HOME</li>
            </Link>
          </div>
          <div className="guest-header-items">
            <Link to='auctions-content'>
              <li className="inline-block">AUCTIONS</li>
            </Link>
          </div>
          <div className="guest-header-items">
            <Link to='jewel-content'>
              <li className="inline-block">JEWELRY</li>
            </Link>
          </div>
          <div className="guest-header-items">
            <Link to='auctions-rule'>
              <li className="inline-block">RULE</li>
            </Link>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              <Forward to='/login'>
                <img src={account} alt="account" className='account' />
              </Forward>
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default GuestHeader;
