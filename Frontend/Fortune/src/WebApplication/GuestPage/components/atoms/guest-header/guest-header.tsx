import React from 'react';
import { Link as Forward } from 'react-router-dom';
import './guest-header.scss';
import logo from '../../../../../../src/assets/img/logo2.png';
import account from '../../../../../../src/assets/img/account.png';
import { Link as ScrollLink } from 'react-scroll';

const GuestHeader: React.FC = () => {
  return (
    <div className="guest-header-home">
      <nav>
        <ul>
          <div className="guest-header-items">
            <img src={logo} alt="logo" className='logo' />
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              <ScrollLink to='guest-introduction' spy={true} offset={-100} duration={500}>
                HOME
              </ScrollLink>
            </li>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              <ScrollLink to='auctions-content' spy={true} offset={-100} duration={500}>
                AUCTIONS
              </ScrollLink>
            </li>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              <ScrollLink to='jewel-content' spy={true} offset={-100} duration={500}>
                JEWELRY
              </ScrollLink>
            </li>
          </div>
          <div className="guest-header-items">
            <li className="inline-block">
              <ScrollLink to='auctions-rule' spy={true} offset={-100} duration={500}>
                RULE
              </ScrollLink>
            </li>
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
