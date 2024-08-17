import React from 'react';

interface HeroSettings {
  color: string;
  speed: number;
  fireRate: number;
}

interface Settings {
  hero1: HeroSettings;
  hero2: HeroSettings;
}

interface SettingsModalProps {
  settings: Settings;
  onChange: (hero: keyof Settings, newSettings: Partial<HeroSettings>) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onChange, onClose }) => {
  const handleColorChange = (hero: keyof Settings, color: string) => {
    onChange(hero, { color });
  }

  const handleSpeedChange = (hero: keyof Settings, speed: number) => {
    onChange(hero, { speed });
  }

  const handleFireRateChange = (hero: keyof Settings, fireRate: number) => {
    onChange(hero, { fireRate });
  }

  return (
    <div className="modal">
      <h2>Настройки</h2>
      {(['hero1', 'hero2'] as Array<keyof Settings>).map((hero) => (
        <div key={hero}>
          <h3>{hero === 'hero1' ? 'Герой 1' : 'Герой 2'}</h3>
          <label>
            Цвет:
            <input 
              type="color" 
              value={settings[hero].color} 
              onChange={(e) => handleColorChange(hero, e.target.value)} 
            />
          </label>
          <label>
            Скорость:
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={settings[hero].speed} 
              onChange={(e) => handleSpeedChange(hero, Number(e.target.value))} 
            />
          </label>
          <label>
            Частота стрельбы:
            <input 
              type="range" 
              min="500" 
              max="2000" 
              value={settings[hero].fireRate} 
              onChange={(e) => handleFireRateChange(hero, Number(e.target.value))} 
            />
          </label>
        </div>
      ))}
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}

export default SettingsModal;