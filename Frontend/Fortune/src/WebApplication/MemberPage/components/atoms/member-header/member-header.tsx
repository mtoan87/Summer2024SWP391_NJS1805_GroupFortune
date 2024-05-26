import React from 'react';
import { Link as Forward } from 'react-router-dom';
import './member-header.scss';
import logo from '../../../../../../src/assets/img/logo2.png';
import { Link as ScrollLink } from 'react-scroll';

const MemberHeader: React.FC = () => {
    const storedUser = sessionStorage.getItem("loginedUser");
    console.log(storedUser);
    const user = storedUser ? JSON.parse(storedUser) : null;

    return (
        <div className="member-header-home">
            <nav>
                <ul>
                    <div className="member-header-items">
                        <img src={logo} alt="logo" className='logo' />
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <ScrollLink to='member-introduction' spy={true} offset={-100} duration={500}>
                                HOME
                            </ScrollLink>
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <ScrollLink to='auctions-content' spy={true} offset={-100} duration={500}>
                                AUCTIONS
                            </ScrollLink>
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <ScrollLink to='jewel-content' spy={true} offset={-100} duration={500}>
                                JEWELRY
                            </ScrollLink>
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <ScrollLink to='auctions-rule' spy={true} offset={-100} duration={500}>
                                RULE
                            </ScrollLink>
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <Forward to='/login'>
                                <span>{user?.name}</span>
                            </Forward>
                        </li>
                    </div>
                </ul>
            </nav>
        </div>
    );
};

export default MemberHeader;
