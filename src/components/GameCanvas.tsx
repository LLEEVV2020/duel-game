import React, { useRef, useEffect, useState } from 'react';

interface GameCanvasProps {
  settings: {
    hero1: { color: string; speed: number; fireRate: number 
      };
    hero2: { color: string; speed: number; fireRate: number };
  };
  openSettingsModal: (hero: 'hero1' | 'hero2') => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ settings, openSettingsModal }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scores, setScores] = useState<{ hero1: number; hero2: number }>({ hero1: 0, hero2: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const width = canvas.width;
    const height = canvas.height;

    const heroes = [
      { id: 'hero1', x: 50, y: height / 2, dx: 0, dy: settings.hero1.speed, color: settings.hero1.color, fireRate: settings.hero1.fireRate, border: 'red' },
      { id: 'hero2', x: width - 50, y: height / 2, dx: 0, dy: settings.hero2.speed, color: settings.hero2.color, fireRate: settings.hero2.fireRate, border: 'blue' },
    ];

    const spells: { heroId: string; x: number; y: number; color: string }[] = [];

    let mouseX = 0;
    let mouseY = 0;

    const draw = () => {
      context.clearRect(0, 0, width, height);

      heroes.forEach((hero) => {
        // Update hero position
        hero.y += hero.dy;
        if (hero.y < 20 || hero.y > height - 20) {
          hero.dy = -hero.dy;
          hero.y += hero.dy;
        }

        // Hero bounce off mouse
        if (Math.abs(hero.y - mouseY) < 25 && Math.abs(hero.x - mouseX) < 25) {
          hero.dy = -hero.dy;
        }

        // Draw hero
        context.beginPath();
        context.arc(hero.x, hero.y, 10, 0, Math.PI * 2);
        context.fillStyle = hero.color;
        context.fill();

        context.lineWidth = 20;        // Установите ширину обводки
        context.strokeStyle = hero.border;   // Установите цвет обводки
        context.stroke();             // Рисуем обводку
      });

      // Update and draw spells
      for (let i = spells.length - 1; i >= 0; i--) {
        const spell = spells[i];

        // Move spells
        if (spell.heroId === 'hero1') {
          spell.x += 5;
        } else {
          spell.x -= 5;
        }

        // Remove spells that are out of bounds
        if (spell.x < 0 || spell.x > width) {
          spells.splice(i, 1);
          continue;
        }

        // Check for collision with heroes
        const hitHero = heroes.find(hero => 
          hero.id !== spell.heroId &&
          Math.abs(hero.x - spell.x) < 25 && Math.abs(hero.y - spell.y) < 25
        );

        if (hitHero) {
          spells.splice(i, 1);
          if (hitHero.id === 'hero1') {
            setScores(scores => ({ ...scores, hero2: scores.hero2 + 1 }));
          } else {
            setScores(scores => ({ ...scores, hero1: scores.hero1 + 1 }));
          }
        } else {
          // Draw spell
          context.beginPath();
          context.arc(spell.x, spell.y, 5, 0, Math.PI * 2);
          context.fillStyle = spell.color;
          context.fill();
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    };

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      heroes.forEach((hero) => {
        if (Math.abs(hero.x - clickX) < 20 && Math.abs(hero.y - clickY) < 20) {
          openSettingsModal(hero.id as 'hero1' | 'hero2');
        }
      });
    };

    const intervalIDs = heroes.map((hero) =>
      setInterval(() => {
        spells.push({
          heroId: hero.id,
          x: hero.x,
          y: hero.y,
          color: settings[hero.id as 'hero1' | 'hero2'].color,
        });
      }, 1000 / hero.fireRate)
    );

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      intervalIDs.forEach(clearInterval);
    };
  }, [settings, openSettingsModal]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} />
      <div className="scoreboard">
        <h3>Табло</h3>
        <p>Герой 1: {scores.hero1}</p>
        <p>Герой 2: {scores.hero2}</p>
      </div>
    </div>
  );
};

export default GameCanvas;