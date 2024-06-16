import React from 'react';
import { Link as Forward } from 'react-router-dom';
import '../styles/guest-header.scss';
import logo from '../img/logo2.png';
import account from '../../../../src/assets/img/person (3).png';
import { Link } from 'react-scroll';

const GuestHeader: React.FC = () => {
    return (
        <div className="guest-header-home">
            <nav>
                <ul>
                    <div className="guest-header-items">
                        <div onClick={() => window.location.reload()}>
                            <img src={logo} alt="logo" className='logo' />
                        </div>
                    </div>
                    <div className="guest-header-items">
                        <li className="inline-block">
                            <Forward to='/'>HOME</Forward>
                        </li>
                    </div>
                    <div className="guest-header-items">
                        <li className="inline-block">
                            <Link to='auctions-content'>AUCTIONS</Link>
                        </li>
                    </div>
                    <div className="guest-header-items">
                        <li className="inline-block">
                            <Link to='jewel-content'>JEWELRY</Link>
                        </li>
                    </div>
                    <div className="guest-header-items">
                        <li className="inline-block">
                            <Link to='auctions-rule'>RULE</Link>
                        </li>
                    </div>
                    <div className="guest-header-items login-container">
                        <li className="inline-block">
                            <Forward to='/login'>
                                <img src={account} alt="account" className='account' />
                                <span>LOGIN</span>
                            </Forward>
                        </li>
                    </div>
                </ul>
            </nav>
        </div>
    );
}

export default GuestHeader;
