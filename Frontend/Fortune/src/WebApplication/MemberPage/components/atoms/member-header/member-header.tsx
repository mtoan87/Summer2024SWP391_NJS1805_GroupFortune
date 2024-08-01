import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './member-header.scss';
import logo from '../../../../../../src/assets/img/logo2.png';
import { Link as ScrollLink } from 'react-scroll';
import { FaRegUser } from "react-icons/fa";
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined, HomeOutlined, AppstoreOutlined, ShoppingOutlined, DollarOutlined, LogoutOutlined, FileTextOutlined, HistoryOutlined, BankOutlined, SettingOutlined } from '@ant-design/icons';

const MemberHeader: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("loginedUser");
        navigate('/');
        window.location.reload();
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const items = [
        {
            key: "1",
            label: "My Biddings",
            icon: <HistoryOutlined />,
            onClick: () => handleNavigate("/userBid")
        },
        {
            key: "2",
            label: "My auctions",
            icon: <AppstoreOutlined />,
            onClick: () => handleNavigate("/userAuc")
        },
        {
            key: "3",
            label: "My jewelries",
            icon: <ShoppingOutlined />,
            onClick: () => handleNavigate("/userJewel")
        },
        {
            key: "4",
            label: "My wallet",
            icon: <BankOutlined />,
            onClick: () => handleNavigate("/userWallet")
        },
        {
            key: "5",
            label: "My transaction",
            icon: <DollarOutlined />,
            onClick: () => handleNavigate("/userTransaction")
        },
        // {
        //     key: "6",
        //     label: "My DashBoard",
        //     icon: <SettingOutlined />,
        //     onClick: () => handleNavigate("/mydashboard")
        // },
        {
            key: "7",
            label: "Logout",
            icon: <LogoutOutlined />,
            onClick: handleLogout
        },
    ];

    return (
        <div className="member-header-home">
            <nav>
                <ul>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <img src={logo} alt="logo" className='logo' onClick={() => handleNavigate('/')} />
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block" onClick={() => handleNavigate('/')}>
                            <HomeOutlined /> HOME
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <ScrollLink to='member-auctions-content' spy={true} offset={-100} duration={500}>
                                <AppstoreOutlined /> AUCTION
                            </ScrollLink>
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <ScrollLink to='member-jewel-content' spy={true} offset={-100} duration={500}>
                                <ShoppingOutlined /> JEWELRY
                            </ScrollLink>
                        </li>
                    </div>
                    <div className="member-header-items">
                        <li className="inline-block">
                            <ScrollLink to='auctions-rule' spy={true} offset={-100} duration={500}>
                                <FileTextOutlined /> RULE
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
                                <Dropdown
                                    menu={{
                                        items: items
                                    }}
                                    trigger={['click']}
                                >
                                    <Button type="link" onClick={e => e.preventDefault()} style={{ display: 'flex', alignItems: 'center' }}>
                                        <FaRegUser className="user-icon" />
                                        <h3 className="user-name" style={{ margin: '0 0 0 5px' }}>{user.name}</h3>
                                        <DownOutlined />
                                    </Button>
                                </Dropdown>
                            </li>
                        </div>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default MemberHeader;
