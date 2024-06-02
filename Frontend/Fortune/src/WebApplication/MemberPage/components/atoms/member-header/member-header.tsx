import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './member-header.scss';
import logo from '../../../../../../src/assets/img/logo2.png';
import { Link as ScrollLink } from 'react-scroll';
import { FaRegUser } from "react-icons/fa";

const MemberHeader: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("loginedUser");
        navigate('/');
    };

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
                            <a onClick={() => navigate('/userAuc')}>AUCTIONS</a>
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
                    {user && (
                        <div
                            className="member-header-items account"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <li className="inline-block user-menu">
                                <FaRegUser className="user-icon" />
                                <span className="user-name">{user.name}</span>
                                {isHovered && (
                                    <ul className="dropdown-menu">
                                        <li><Link to="/userAuc">My auctions</Link></li>
                                        <li><Link to="/userJew">My jewelries</Link></li>
                                        <li><Link to="/account">About account</Link></li>
                                        <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                                    </ul>
                                )}
                            </li>
                        </div>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default MemberHeader;
