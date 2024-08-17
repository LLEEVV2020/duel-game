import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import SettingsModal from './components/SettingsModal';

// Определим тип для описания настроек героя
interface HeroSettings {
  color: string;
  speed: number;
  fireRate: number;
}

interface Settings {
  hero1: HeroSettings;
  hero2: HeroSettings;
}

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    hero1: { color: 'red', speed: 2, fireRate: 1000 },
    hero2: { color: 'blue', speed: 2, fireRate: 1000 },
  });

  const toggleModal = () => setShowModal(!showModal);

  const handleSettingsChange = (hero: keyof Settings, newSettings: Partial<HeroSettings>) => {
    setSettings((prev) => ({
      ...prev,
      [hero]: { ...prev[hero], ...newSettings },
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Игра "Дуэль"</h1>
        <button onClick={toggleModal}>Настройки</button>
      </header>
      {showModal && 
        <SettingsModal 
          settings={settings} 
          onChange={handleSettingsChange} 
          onClose={toggleModal} 
        />
      }
      <GameCanvas settings={settings} />
    </div>
  );
};

export default App;