import React, { useState } from 'react';
import { MdSettings, MdClose, MdBrightness6, MdNotifications, MdEmail } from 'react-icons/md';
import './Settings.css';

const Settings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    pushNotifications: JSON.parse(localStorage.getItem('pushNotifications') || 'true'),
    emailNotifications: JSON.parse(localStorage.getItem('emailNotifications') || 'false')
  });

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(key, typeof value === 'boolean' ? JSON.stringify(value) : value);
    
    if (key === 'theme') {
      document.documentElement.setAttribute('data-theme', value);
    }
  };

  return (
    <>
      <button
        className="settings-btn"
        onClick={() => setIsModalOpen(true)}
        aria-label="Settings"
      >
        <MdSettings />
      </button>

      {isModalOpen && (
        <div className="settings-overlay">
          <div className="settings-modal">
            <div className="settings-header">
              <h2>Settings</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <MdClose />
              </button>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <div className="setting-label">
                  <MdBrightness6 />
                  <label>Theme</label>
                </div>
                <select 
                  value={settings.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <MdNotifications />
                  <label>Push Notifications</label>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <MdEmail />
                  <label>Email Notifications</label>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
