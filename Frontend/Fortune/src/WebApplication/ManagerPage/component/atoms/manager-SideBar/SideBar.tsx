// Sidebar.js
import React, { useState } from 'react';
import "./Sidebar.scss";

function Sidebar({ toggleSidebar, isOpen }) {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isOpen ? '<' : '>'}
            </button>
            <nav>
                <ul>
                    <li><a href="#section1">Section 1</a></li>
                    <li><a href="#section2">Section 2</a></li>
                    <li><a href="#section3">Section 3</a></li>
                    <li><a href="#section4">Section 4</a></li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
