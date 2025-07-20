import { motion } from 'framer-motion';
import { Player } from '../types/game';

interface TurnIndicatorProps {
  currentPlayer: Player;
  currentPlayerIndex: number;
  timeLeft?: number;
  timerEnabled?: boolean;
}

export const TurnIndicator = ({ 
  currentPlayer, 
  currentPlayerIndex, 
  timeLeft, 
  timerEnabled 
}: TurnIndicatorProps) => {
  const getPlayerColorClass = (index: number) => {
    const colors = ['player-1', 'player-2', 'player-3', 'player-4'];
    return colors[index] || 'player-1';
  };

  const playerColorClass = getPlayerColorClass(currentPlayerIndex);

  return (
    <motion.div
      className={`gaming-card p-6 text-center ${playerColorClass}`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-current mb-2"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {currentPlayer.name}'s Turn
      </motion.h2>
      
      {timerEnabled && timeLeft !== undefined && (
        <motion.div
          className="mt-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="text-lg font-semibold mb-2">Time Left</div>
          <motion.div
            className="text-4xl font-bold text-current"
            animate={{ 
              scale: timeLeft <= 5 ? [1, 1.2, 1] : 1,
              color: timeLeft <= 5 ? ['currentColor', '#ef4444', 'currentColor'] : 'currentColor'
            }}
            transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
          >
            {timeLeft}s
          </motion.div>
          
          <div className="mt-2 w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-current rounded-full"
              animate={{ 
                width: `${((timeLeft || 0) / 30) * 100}%`,
                backgroundColor: timeLeft && timeLeft <= 5 ? '#ef4444' : 'currentColor'
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};