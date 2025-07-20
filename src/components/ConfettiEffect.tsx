import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiEffectProps {
  isActive: boolean;
  playerColor: string;
}

export const ConfettiEffect = ({ isActive, playerColor }: ConfettiEffectProps) => {
  const [confettiPieces, setConfettiPieces] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      setConfettiPieces(Array.from({ length: 50 }, (_, i) => i));
    } else {
      setConfettiPieces([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  const getRandomColor = () => {
    const colors = [playerColor, '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FCEA2B'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece}
          className="absolute w-3 h-3 opacity-80"
          style={{
            backgroundColor: getRandomColor(),
            left: `${Math.random() * 100}%`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
          initial={{
            y: -100,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: 720,
            opacity: 0,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};