import React, { useState } from 'react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Analysis');

  const menuItems = [
    { name: 'Overview', icon: 'fas fa-file-alt' },
    { name: 'Analysis', icon: 'fas fa-chart-bar' },
    { name: 'Objectives', icon: 'fas fa-bullseye' },
    { name: 'Simulation', icon: 'fas fa-play-circle' },
    { name: 'Memory Usage', icon: 'fas fa-memory' },
    { name: 'Manual Use', icon: 'fas fa-hand-paper' },
    { name: 'Settings', icon: 'fas fa-cog' },
    { name: 'Support & Help', icon: 'fas fa-question-circle' }
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.name}
              className={activeItem === item.name ? 'active' : ''}
              onClick={() => setActiveItem(item.name)}
            >
              <i className={item.icon}></i> {item.name}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;