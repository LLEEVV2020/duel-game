import React, { useState } from 'react';

interface HeroSettings {
  color: string;
  speed: number;
  fireRate: number;
}

interface SettingsModalProps {
  visible: boolean;
  settings: HeroSettings;
  onClose: () => void;
  onSave: (newSettings: Partial<HeroSettings>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, settings, onClose, onSave }) => {
  const [newSettings, setNewSettings] = useState<Partial<HeroSettings>>({
    color: settings.color,
    speed: settings.speed,
    fireRate: settings.fireRate,
  });

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSettings((prev) => ({ ...prev, color: e.target.value }));
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSettings((prev) => ({ ...prev, speed: parseFloat(e.target.value) }));
  };

  const handleFireRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSettings((prev) => ({ ...prev, fireRate: parseFloat(e.target.value) }));
  };

  const handleSave = () => {
    onSave(newSettings);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Настройки героя</h2>
        <div>
          <label>
            Цвет:
            <input type="color" value={newSettings.color} onChange={handleColorChange} />
          </label>
        </div>
        <div>
          <label>
            Скорость:
            <input type="range" min="0.5" max="4.0" step="0.1" value={newSettings.speed} onChange={handleSpeedChange} />
          </label>
        </div>
        <div>
          <label>
            Частота стрельбы:
            <input type="range" min="2.5" max="10.0" step="0.5" value={newSettings.fireRate} onChange={handleFireRateChange} />
          </label>
        </div>
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
};

export default SettingsModal;