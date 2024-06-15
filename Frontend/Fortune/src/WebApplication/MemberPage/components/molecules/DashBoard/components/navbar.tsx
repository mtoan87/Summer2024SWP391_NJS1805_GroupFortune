import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/navbar.scss';
import logo from '../../../../../../../src/assets/img/logo2.png';
import { Link as ScrollLink } from 'react-scroll';


const MemberHeader: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate();


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
                            <ScrollLink to='auctions-container' spy={true} offset={-100} duration={500}>
                                AUCTION
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
                    {user && (
                        <div className="member-header-items">
                            <li
                                className="inline-block"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            >
                            </li>
                        </div>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default MemberHeader;
