import React from 'react';
import { Link as Forward } from 'react-router-dom';
import '../styles/guest-header.scss';
import logo from '../img/logo2.png';
import account from '../img/account.png';
import { Link } from 'react-scroll';

const GuestHeader: React.FC = () => {
    return (
        <div className="guest-header-home">
            <nav>
                <ul>
                    <div className="guest-header-items">
                        <div onClick={() => window.location.reload()}> {/* Đường link để nhảy về trang chủ */}
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
                            <Forward to='/jewelry'>JEWELRY</Forward>
                        </li>
                    </div>
                    <div className="guest-header-items">
                        <li className="inline-block">
                            <Forward to='/rule'>RULE</Forward>
                        </li>
                    </div>
                    <div className="guest-header-items login-container">
                        <li className="inline-block">
                            <Forward to='/login'>
                                <img src={account} alt="account" className='account' />
                                <span>Login</span>
                            </Forward>
                        </li>
                    </div>
                </ul>
            </nav>
        </div>
    );
}

export default GuestHeader;
