import { motion } from 'framer-motion';
import { Player } from '../types/game';

interface ScoreboardProps {
  players: Player[];
  currentPlayerIndex: number;
  currentScore: number;
  targetScore: number;
}

export const Scoreboard = ({ players, currentPlayerIndex, currentScore, targetScore }: ScoreboardProps) => {
  const getPlayerColorClass = (index: number) => {
    const colors = ['player-1', 'player-2', 'player-3', 'player-4'];
    return colors[index] || 'player-1';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
      {players.map((player, index) => {
        const isCurrentPlayer = index === currentPlayerIndex;
        const playerColorClass = getPlayerColorClass(index);
        
        return (
          <motion.div
            key={index}
            className={`gaming-card p-4 transition-all duration-300 ${playerColorClass} ${
              isCurrentPlayer ? 'active-player' : ''
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: isCurrentPlayer ? 1.05 : 1, 
              opacity: 1 
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2 text-current">
                {player.name}
              </h3>
              
              <motion.div 
                className="text-3xl font-bold mb-2"
                animate={{ scale: isCurrentPlayer ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5, repeat: isCurrentPlayer ? Infinity : 0 }}
              >
                {player.score}
              </motion.div>
              
              {isCurrentPlayer && (
                <motion.div
                  className="text-sm opacity-80"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Turn: +{currentScore}
                </motion.div>
              )}
              
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-current rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((player.score / targetScore) * 100, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};