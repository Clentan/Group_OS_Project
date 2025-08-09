import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { icon: 'fas fa-file-alt', label: 'Overview', active: false },
    { icon: 'fas fa-chart-bar', label: 'Analysis', active: true },
    { icon: 'fas fa-bullseye', label: 'Objectives', active: false },
    { icon: 'fas fa-play-circle', label: 'Simulation', active: false },
    { icon: 'fas fa-memory', label: 'Memory Usage', active: false },
    { icon: 'fas fa-hand-paper', label: 'Manual Use', active: false },
    { icon: 'fas fa-cog', label: 'Settings', active: false },
    { icon: 'fas fa-question-circle', label: 'Support & Help', active: false },
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className={item.active ? 'active' : ''}>
              <i className={item.icon}></i> {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;