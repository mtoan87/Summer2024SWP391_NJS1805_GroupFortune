import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './member-header.scss';
import logo from '../../../../../../src/assets/img/logo2.png';
import { Link as ScrollLink } from 'react-scroll';
import { FaRegUser } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';

const StaffHeader: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("loginedUser");
        navigate('/');
        window.location.reload();
    };
    const hometag = () => {
        navigate('/');
    }
    return (
        <div className="member-header-home">
            <nav>
                <ul>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <img src={logo} alt="logo" className='logo' onClick={() => hometag()} />
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <Link to='/'>
                                HOME
                            </Link>
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <ScrollLink to='member-auctions-content' spy={true} offset={-100} duration={500}>
                                AUCTION
                            </ScrollLink>
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <ScrollLink to='member-jewel-content' spy={true} offset={-100} duration={500}>
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
                        <div className="member-header-items">
                            <li
                                className="inline-block"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            >
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ display: 'flex', alignItems: 'center' }}>
                                        <FaRegUser className="user-icon" />
                                        <h3 className="user-name" style={{ margin: '0 0 0 5px' }}>{user.name}</h3>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>

                                        <Dropdown.Item href="/staffprofile">My Profile</Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </div>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default StaffHeader;
