import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { icon: 'fas fa-file-alt', label: 'Overview', page: 'Overview' },
    { icon: 'fas fa-chart-bar', label: 'Analysis', page: 'Analysis' },
    { icon: 'fas fa-bullseye', label: 'Objectives', page: 'Objectives' },
    { icon: 'fas fa-play-circle', label: 'Simulation', page: 'Simulation' },
    { icon: 'fas fa-memory', label: 'Memory Usage', page: 'Memory Usage' },
    { icon: 'fas fa-hand-paper', label: 'Manual Use', page: 'Manual Use' },
    { icon: 'fas fa-cog', label: 'Settings', page: 'Settings' },
    { icon: 'fas fa-question-circle', label: 'Support & Help', page: 'Support & Help' },
  ];

  const handleItemClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {menuItems.map((item, index) => (
            <li 
              key={index} 
              className={`sidebar__item ${currentPage === item.page ? 'sidebar__item--active' : ''}`}
              onClick={() => handleItemClick(item.page)}
              style={{ cursor: 'pointer' }}
            >
              <i className={item.icon}></i> {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;