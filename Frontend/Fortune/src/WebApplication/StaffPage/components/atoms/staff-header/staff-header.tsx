import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './member-header.scss';
import logo from '../../../../../../src/assets/img/logo2.png';
import { FaRegUser } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

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
    };

    return (
        <div className="staff-header-home">
            <nav>
                <div>
                    <img src={logo} alt="logo" className='logo' onClick={hometag} />
                </div>
                <ul>
                    {user && (
                        <div className="staff-header-items">
                            <li
                                className="inline-block"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            >
                                <Dropdown show={isHovered} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ display: 'flex', alignItems: 'center' }}>
                                        <FaRegUser className="user-icon" />
                                        <h3 className="user-name" style={{ margin: '0 0 0 5px' }}>{user.name}</h3>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="/staffprofile">
                                            <UserOutlined style={{ marginRight: '8px' }} />
                                            My Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>
                                            <LogoutOutlined style={{ marginRight: '8px' }} />
                                            Logout
                                        </Dropdown.Item>
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
