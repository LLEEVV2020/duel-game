import React, { useRef, useEffect } from 'react';

interface Hero {
  x: number;
  y: number;
  color: string;
  speed: number;
  fireRate: number;
}

interface HeroSettings {
  color: string;
  speed: number;
  fireRate: number;
}

interface Settings {
  hero1: HeroSettings;
  hero2: HeroSettings;
}

interface GameCanvasProps {
  settings: Settings;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hero1Ref = useRef<Hero | null>(null);
  const hero2Ref = useRef<Hero | null>(null);
  const direction = useRef({ hero1: 1, hero2: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        hero1Ref.current = { x: 50, y: canvas.height / 2, ...settings.hero1 };
        hero2Ref.current = { x: canvas.width - 50, y: canvas.height / 2, ...settings.hero2 };

        const checkCollisionWithCursor = (hero: Hero, mouseX: number, mouseY: number) => {
          const dx = hero.x - mouseX;
          const dy = hero.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 25) {
            if (dx < 0) {
              hero.x -= hero.speed;
            } else {
              hero.x += hero.speed;
            }
            if (dy < 0) {
              hero.y -= hero.speed;
            } else {
              hero.y += hero.speed;
            }
          }
        };

        const draw = () => {
          if (hero1Ref.current && hero2Ref.current) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            const heroes = [hero1Ref.current, hero2Ref.current];

            // Движение и отрисовка героев
            heroes.forEach((hero, index) => {
              if (hero.y + 20 > canvas.height || hero.y - 20 < 0) {
                direction.current[`hero${index + 1}` as 'hero1' | 'hero2'] *= -1;
              }
              hero.y += hero.speed * direction.current[`hero${index + 1}` as 'hero1' | 'hero2'];

              context.beginPath();
              context.arc(hero.x, hero.y, 20, 0, Math.PI * 2);
              context.fillStyle = hero.color;
              context.fill();
              context.closePath();
            });

            requestAnimationFrame(draw);
          }
        };

        draw();

        const handleMouseMove = (e: MouseEvent) => {
          if (hero1Ref.current && hero2Ref.current) {
            checkCollisionWithCursor(hero1Ref.current, e.clientX, e.clientY);
            checkCollisionWithCursor(hero2Ref.current, e.clientX, e.clientY);
          }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
      }
    }
  }, [settings]);

  return <canvas ref={canvasRef} width={800} height={400}></canvas>;
};

export default GameCanvas;