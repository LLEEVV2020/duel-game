import React, { useState, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import SettingsModal from './components//SettingsModal';

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
  const [selectedHero, setSelectedHero] = useState<keyof Settings | null>(null);
  const [settings, setSettings] = useState<Settings>({
    hero1: { color: 'red', speed: 2, fireRate: 1 },
    hero2: { color: 'blue', speed: 2, fireRate: 1 },
  });

  const toggleModal = useCallback(() => setShowModal(!showModal), [showModal]);

  const handleSettingsChange = (hero: keyof Settings, newSettings: Partial<HeroSettings>) => {
    setSettings((prev) => ({
      ...prev,
      [hero]: { ...prev[hero], ...newSettings },
    }));
  };

  const openSettingsModal = (hero: keyof Settings) => {
    setSelectedHero(hero);
    toggleModal();
  };

  return (
    <div>
        <h1> игра "Дуэль"</h1>
      <GameCanvas
        settings={settings}
        openSettingsModal={openSettingsModal}
      />
      {selectedHero && (
        <SettingsModal
          visible={showModal}
          settings={settings[selectedHero]}
          onClose={toggleModal}
          onSave={(newSettings) => handleSettingsChange(selectedHero, newSettings)}
        />
      )}
    </div>
  );
};

export default App;