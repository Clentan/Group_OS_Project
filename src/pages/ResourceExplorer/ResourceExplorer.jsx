import React, { useState } from 'react';
import './ResourceExplorer.css';

const ResourceExplorer = ({ setCurrentPage }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources = [
    // Hardware Resources (1-18)
    {
      id: 1,
      category: 'hardware',
      name: 'CPU',
      identification: 'Intel Core i7-10700K, ID: CPU-1',
      capacity: '3.8 GHz base, 5.1 GHz turbo, 8 cores, 16 threads',
      status: 'Active, Temp: 45°C',
      access: 'OS scheduler, root/admin',
      location: 'On motherboard',
      icon: 'fas fa-microchip',
      color: '#e74c3c'
    },
    {
      id: 2,
      category: 'hardware',
      name: 'GPU',
      identification: 'NVIDIA RTX 3060, ID: GPU-1',
      capacity: '12 GB GDDR6 VRAM, 1.78 GHz boost',
      status: 'Active, 60°C',
      access: 'Graphics driver, user apps',
      location: 'PCIe x16 slot',
      icon: 'fas fa-display',
      color: '#27ae60'
    },
    {
      id: 3,
      category: 'hardware',
      name: 'RAM',
      identification: 'Kingston HyperX DDR4, MEM-2',
      capacity: '16 GB, 3200 MHz',
      status: '8.3 GB in use',
      access: 'Shared between processes',
      location: 'DIMM slots on motherboard',
      icon: 'fas fa-memory',
      color: '#3498db'
    },
    {
      id: 4,
      category: 'hardware',
      name: 'ROM',
      identification: 'AMI BIOS chip, ROM-1',
      capacity: '8 MB firmware storage',
      status: 'Read-only, Healthy',
      access: 'Motherboard firmware control',
      location: 'Motherboard',
      icon: 'fas fa-microchip',
      color: '#8e44ad'
    },
    {
      id: 5,
      category: 'hardware',
      name: 'SSD',
      identification: 'Samsung 970 EVO Plus',
      capacity: '1 TB, 3500 MB/s read, 3300 MB/s write',
      status: 'Healthy, 98% life',
      access: 'File system',
      location: 'M.2 NVMe slot',
      icon: 'fas fa-hdd',
      color: '#f39c12'
    },
    {
      id: 6,
      category: 'hardware',
      name: 'HDD',
      identification: 'Seagate Barracuda',
      capacity: '2 TB, 150 MB/s',
      status: 'Healthy',
      access: 'File storage, archival',
      location: 'SATA connection',
      icon: 'fas fa-hdd',
      color: '#34495e'
    },
    {
      id: 7,
      category: 'hardware',
      name: 'Cache Memory',
      identification: 'CPU L1/L2/L3 cache',
      capacity: 'L1: 512 KB, L2: 4 MB, L3: 16 MB',
      status: 'Active',
      access: 'CPU-controlled',
      location: 'Inside CPU',
      icon: 'fas fa-memory',
      color: '#e67e22'
    },
    {
      id: 8,
      category: 'hardware',
      name: 'Motherboard',
      identification: 'ASUS Prime Z490-A',
      capacity: 'ATX, supports Intel 10th Gen',
      status: 'Healthy',
      access: 'All devices connect here',
      location: 'System chassis',
      icon: 'fas fa-microchip',
      color: '#2c3e50'
    },
    {
      id: 9,
      category: 'hardware',
      name: 'PSU',
      identification: 'Corsair RM650x',
      capacity: '650W, 80+ Gold certified',
      status: 'On, Stable voltage',
      access: 'Power delivery',
      location: 'Case bottom',
      icon: 'fas fa-bolt',
      color: '#f1c40f'
    },
    {
      id: 10,
      category: 'hardware',
      name: 'Sound Card',
      identification: 'Creative SBX AE-5',
      capacity: '32-bit/384kHz playback',
      status: 'Active',
      access: 'Audio driver',
      location: 'PCIe slot',
      icon: 'fas fa-volume-up',
      color: '#9b59b6'
    },
    {
      id: 11,
      category: 'hardware',
      name: 'NIC',
      identification: 'Intel I219-V Ethernet Adapter',
      capacity: '1 Gbps bandwidth',
      status: 'Connected, stable',
      access: 'Network driver, OS',
      location: 'On motherboard',
      icon: 'fas fa-ethernet',
      color: '#16a085'
    },
    {
      id: 12,
      category: 'hardware',
      name: 'Optical Drive',
      identification: 'LG GH24NSD1',
      capacity: '16x DVD, 48x CD',
      status: 'Idle',
      access: 'Read/write software',
      location: '5.25-inch bay',
      icon: 'fas fa-compact-disc',
      color: '#95a5a6'
    },
    {
      id: 13,
      category: 'hardware',
      name: 'USB Flash Drive',
      identification: 'SanDisk Ultra',
      capacity: '32 GB, 150 MB/s read',
      status: 'Plugged in',
      access: 'Removable storage',
      location: 'USB port',
      icon: 'fas fa-usb',
      color: '#e74c3c'
    },
    {
      id: 14,
      category: 'hardware',
      name: 'External HDD',
      identification: 'WD MyBook',
      capacity: '4 TB, 140 MB/s',
      status: 'Healthy',
      access: 'Backup storage',
      location: 'USB 3.0',
      icon: 'fas fa-hdd',
      color: '#34495e'
    },
    {
      id: 15,
      category: 'hardware',
      name: 'Monitor',
      identification: 'Dell P2419H',
      capacity: '24", 1080p, 75Hz',
      status: 'On',
      access: 'Display driver',
      location: 'HDMI cable',
      icon: 'fas fa-desktop',
      color: '#2980b9'
    },
    {
      id: 16,
      category: 'hardware',
      name: 'Keyboard',
      identification: 'Logitech K120',
      capacity: 'USB wired',
      status: 'Active',
      access: 'User input',
      location: 'Desk',
      icon: 'fas fa-keyboard',
      color: '#7f8c8d'
    },
    {
      id: 17,
      category: 'hardware',
      name: 'Mouse',
      identification: 'Logitech M90',
      capacity: 'Optical, USB',
      status: 'Active',
      access: 'User input',
      location: 'Desk',
      icon: 'fas fa-mouse',
      color: '#7f8c8d'
    },
    {
      id: 18,
      category: 'hardware',
      name: 'Printer',
      identification: 'HP LaserJet Pro M404dn',
      capacity: '30 ppm, 1200 dpi',
      status: 'Online, Ready',
      access: 'Print service',
      location: 'USB/Wi-Fi',
      icon: 'fas fa-print',
      color: '#34495e'
    },

    // Software Resources (19-30)
    {
      id: 19,
      category: 'software',
      name: 'OS Kernel',
      identification: 'Windows 11 Kernel',
      capacity: '64-bit',
      status: 'Running',
      access: 'System processes',
      location: 'RAM',
      icon: 'fas fa-cogs',
      color: '#3498db'
    },
    {
      id: 20,
      category: 'software',
      name: 'System Libraries',
      identification: 'Win32 API, DLL files',
      capacity: 'N/A',
      status: 'Loaded',
      access: 'Programs',
      location: 'File system',
      icon: 'fas fa-book',
      color: '#9b59b6'
    },
    {
      id: 21,
      category: 'software',
      name: 'Device Drivers',
      identification: 'NVIDIA Driver v546.01',
      capacity: 'N/A',
      status: 'Active',
      access: 'Hardware control',
      location: 'File system',
      icon: 'fas fa-tools',
      color: '#e67e22'
    },
    {
      id: 22,
      category: 'software',
      name: 'Application Software',
      identification: 'Microsoft Word 2021',
      capacity: 'N/A',
      status: 'Running',
      access: 'User licensed',
      location: 'Installed drive',
      icon: 'fas fa-file-word',
      color: '#2980b9'
    },
    {
      id: 23,
      category: 'software',
      name: 'Database System',
      identification: 'MySQL 8.0',
      capacity: 'Handles queries/sec',
      status: 'Running',
      access: 'DB admin',
      location: 'Localhost',
      icon: 'fas fa-database',
      color: '#f39c12'
    },
    {
      id: 24,
      category: 'software',
      name: 'File System',
      identification: 'NTFS',
      capacity: '1 TB volume',
      status: 'Mounted',
      access: 'OS managed',
      location: 'Storage device',
      icon: 'fas fa-folder',
      color: '#27ae60'
    },
    {
      id: 25,
      category: 'software',
      name: 'Virtual Machine',
      identification: 'Ubuntu 22.04 VM',
      capacity: '4 GB RAM, 2 vCPUs',
      status: 'Running',
      access: 'Hypervisor',
      location: 'Virtual host',
      icon: 'fas fa-server',
      color: '#e74c3c'
    },
    {
      id: 26,
      category: 'software',
      name: 'Container Image',
      identification: 'Docker Nginx Image',
      capacity: 'N/A',
      status: 'Available',
      access: 'Container engine',
      location: 'Local/Cloud registry',
      icon: 'fab fa-docker',
      color: '#3498db'
    },
    {
      id: 27,
      category: 'software',
      name: 'API Endpoints',
      identification: '/api/users',
      capacity: 'Processes JSON requests',
      status: 'Active',
      access: 'API gateway',
      location: 'Web server',
      icon: 'fas fa-code',
      color: '#8e44ad'
    },
    {
      id: 28,
      category: 'software',
      name: 'Auth Tokens',
      identification: 'JWT Access Token',
      capacity: 'Expiry: 1 hr',
      status: 'Valid',
      access: 'Auth service',
      location: 'Secure store',
      icon: 'fas fa-key',
      color: '#e67e22'
    },
    {
      id: 29,
      category: 'software',
      name: 'Encryption Keys',
      identification: 'AES-256 Keys',
      capacity: '256-bit',
      status: 'Secure',
      access: 'Key vault',
      location: 'Encrypted storage',
      icon: 'fas fa-lock',
      color: '#c0392b'
    },
    {
      id: 30,
      category: 'software',
      name: 'System Logs',
      identification: '/var/log/syslog',
      capacity: 'Rotates daily',
      status: 'Updating',
      access: 'Root access',
      location: 'Log directory',
      icon: 'fas fa-file-alt',
      color: '#95a5a6'
    },

    // Network Resources (31-36)
    {
      id: 31,
      category: 'network',
      name: 'Bandwidth',
      identification: 'Ethernet Link',
      capacity: '1 Gbps max',
      status: '350 Mbps used',
      access: 'Network admin',
      location: 'LAN cable',
      icon: 'fas fa-tachometer-alt',
      color: '#2ecc71'
    },
    {
      id: 32,
      category: 'network',
      name: 'IP Address',
      identification: '192.168.0.10',
      capacity: 'IPv4',
      status: 'Assigned',
      access: 'DHCP server',
      location: 'Local network',
      icon: 'fas fa-globe',
      color: '#3498db'
    },
    {
      id: 33,
      category: 'network',
      name: 'DNS Entry',
      identification: 'example.com',
      capacity: 'Resolves to IP',
      status: 'Active',
      access: 'DNS admin',
      location: 'DNS server',
      icon: 'fas fa-sitemap',
      color: '#9b59b6'
    },
    {
      id: 34,
      category: 'network',
      name: 'Port',
      identification: 'TCP 443',
      capacity: 'HTTPS',
      status: 'Open',
      access: 'Firewall rules',
      location: 'Network stack',
      icon: 'fas fa-door-open',
      color: '#e67e22'
    },
    {
      id: 35,
      category: 'network',
      name: 'Cloud Storage',
      identification: 'Google Drive',
      capacity: '15 GB free',
      status: 'Synced',
      access: 'Google account',
      location: 'Cloud',
      icon: 'fas fa-cloud',
      color: '#f39c12'
    },
    {
      id: 36,
      category: 'network',
      name: 'VPN Connection',
      identification: 'OpenVPN Session',
      capacity: '100 Mbps',
      status: 'Connected',
      access: 'VPN client',
      location: 'Secure tunnel',
      icon: 'fas fa-shield-alt',
      color: '#27ae60'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: 'fas fa-th', color: '#34495e' },
    { id: 'hardware', name: 'Hardware', icon: 'fas fa-microchip', color: '#e74c3c' },
    { id: 'software', name: 'Software', icon: 'fas fa-code', color: '#3498db' },
    { id: 'network', name: 'Network', icon: 'fas fa-network-wired', color: '#2ecc71' }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const handleBackToSimulation = () => {
    setCurrentPage('Simulation');
  };

  return (
    <div className="resource-explorer-container">
      <div className="explorer-header">
        <button className="back-btn" onClick={handleBackToSimulation}>
          <i className="fas fa-arrow-left"></i>
          Back to Simulation
        </button>
        <h1>System Resource Explorer</h1>
        <p>Comprehensive view of all 36 system resources with detailed specifications</p>
      </div>

      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
            style={{ 
              backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
              borderColor: category.color,
              color: selectedCategory === category.id ? 'white' : category.color
            }}
          >
            <i className={category.icon}></i>
            {category.name}
            <span className="count">
              ({category.id === 'all' ? resources.length : resources.filter(r => r.category === category.id).length})
            </span>
          </button>
        ))}
      </div>

      <div className="resources-grid">
        {filteredResources.map((resource) => (
          <div 
            key={resource.id} 
            className={`resource-card ${selectedResource === resource.id ? 'selected' : ''}`}
            onClick={() => setSelectedResource(selectedResource === resource.id ? null : resource.id)}
          >
            <div className="resource-header">
              <div className="resource-icon" style={{ color: resource.color }}>
                <i className={resource.icon}></i>
              </div>
              <div className="resource-title">
                <h3>{resource.name}</h3>
                <span className="resource-id">#{resource.id}</span>
              </div>
            </div>
            
            <div className="resource-summary">
              <div className="summary-item">
                <strong>ID:</strong> {resource.identification}
              </div>
              <div className="summary-item">
                <strong>Status:</strong> 
                <span className="status-badge">{resource.status}</span>
              </div>
            </div>

            {selectedResource === resource.id && (
              <div className="resource-details">
                <div className="detail-section">
                  <h4><i className="fas fa-info-circle"></i> Identification</h4>
                  <p>{resource.identification}</p>
                </div>
                
                <div className="detail-section">
                  <h4><i className="fas fa-tachometer-alt"></i> Capacity/Performance</h4>
                  <p>{resource.capacity}</p>
                </div>
                
                <div className="detail-section">
                  <h4><i className="fas fa-heartbeat"></i> Status/Health</h4>
                  <p>{resource.status}</p>
                </div>
                
                <div className="detail-section">
                  <h4><i className="fas fa-user-shield"></i> Access/Ownership</h4>
                  <p>{resource.access}</p>
                </div>
                
                <div className="detail-section">
                  <h4><i className="fas fa-map-marker-alt"></i> Location/Connectivity</h4>
                  <p>{resource.location}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedResource && (
        <div className="resource-summary-table">
          <h2>Resource Summary Table</h2>
          <div className="table-container">
            <table className="resource-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Identification</th>
                  <th>Capacity/Performance</th>
                  <th>Status/Health</th>
                  <th>Access/Ownership</th>
                  <th>Location/Connectivity</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((resource) => (
                  <tr key={resource.id} className={selectedResource === resource.id ? 'highlighted' : ''}>
                    <td>
                      <div className="table-resource-name">
                        <i className={resource.icon} style={{ color: resource.color }}></i>
                        {resource.name}
                      </div>
                    </td>
                    <td>{resource.identification}</td>
                    <td>{resource.capacity}</td>
                    <td>
                      <span className="table-status-badge">{resource.status}</span>
                    </td>
                    <td>{resource.access}</td>
                    <td>{resource.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceExplorer;