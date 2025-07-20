import { motion } from 'framer-motion';
import { useState } from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRollComplete?: () => void;
}

export const Dice = ({ value, isRolling, onRollComplete }: DiceProps) => {
  const [displayValue, setDisplayValue] = useState(value);

  const getDiceDots = (num: number) => {
    const patterns = {
      1: [[1, 1]],
      2: [[0, 2], [2, 0]],
      3: [[0, 2], [1, 1], [2, 0]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
    };
    return patterns[num as keyof typeof patterns] || [];
  };

  const handleAnimationComplete = () => {
    setDisplayValue(value);
    onRollComplete?.();
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl shadow-lg border-2 border-gray-200"
        style={{
          background: 'var(--gradient-dice)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)'
        }}
        animate={isRolling ? {
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        } : {}}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        onAnimationComplete={handleAnimationComplete}
      >
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-2">
          {getDiceDots(isRolling ? Math.floor(Math.random() * 6) + 1 : displayValue).map((position, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 md:w-3 md:h-3 bg-gray-800 rounded-full"
              style={{
                gridColumn: position[1] + 1,
                gridRow: position[0] + 1,
                justifySelf: 'center',
                alignSelf: 'center'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};