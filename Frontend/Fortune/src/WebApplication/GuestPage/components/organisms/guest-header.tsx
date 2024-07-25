import React from 'react';
import { Link as Forward } from 'react-router-dom';
import '../../styles/guest-header.scss';
import logo from '../../img/logo2.png';
import account from '../../../../../src/assets/img/person (3).png';
import { Link } from 'react-scroll';
import { HomeOutlined, AppstoreOutlined, ShoppingOutlined, FileTextOutlined } from '@ant-design/icons';
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
                            <Link to='guest-introduction'> <HomeOutlined /> HOME</Link>
                        </li>
                    </div>
                    <div className="guest-header-items">
                        <li className="inline-block">
                            <Link to='blank-space'> <AppstoreOutlined /> AUCTIONS</Link>
                        </li>
                    </div>
                    <div className="guest-header-items">
                        <li className="inline-block">
                            <Link to='jewelry-content'> <ShoppingOutlined /> JEWELRY</Link>
                        </li>
                    </div>
                    <div className="guest-header-items">
                        <li className="inline-block">
                            <Link to='auctions-rule'> <FileTextOutlined /> RULE</Link>
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
