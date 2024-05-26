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
            <Link to='guest-introduction' spy={true} offset={-100} duration={500}>
              <li className="inline-block">
                <a href="">HOME</a>
              </li>
            </Link>
          </div>
          <div className="guest-header-items">
            <Link to='auctions-content' spy={true} offset={-100} duration={500}>
              <li className="inline-block">
                <a href="">AUCTIONS</a>
              </li>
            </Link>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              <Link to='jewel-content' spy={true} offset={-100} duration={500}>
                <a href="">JEWELRY</a>
              </Link></li>
          </div>
          <div className="guest-header-items">
            <Link to='auctions-rule' spy={true} offset={-100} duration={500}>
              <li className="inline-block">
                <a href="">RULE</a>
              </li>
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
