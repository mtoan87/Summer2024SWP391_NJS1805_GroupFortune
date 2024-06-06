// ManagerHomePg.js
import React, { useState } from 'react';
import MemberHeader from '../../component/atoms/member-header/member-header';
import MemberFooter from '../../component/atoms/member-footer/member-footer';
import ManagerHomeBody from '../template/ManagerHomeBody';
import Sidebar from '../../component/atoms/manager-SideBar/SideBar';
import "./ManagerHomePg.scss";

function ManagerHomePg() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`mainContent ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <header>
                    <MemberHeader />
                </header>
                <div className='managerHomeBody'>
                    <ManagerHomeBody />
                </div>
                <footer>
                    <MemberFooter />
                </footer>
            </div>
        </>
    );
}

export default ManagerHomePg;
