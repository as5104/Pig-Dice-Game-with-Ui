import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Player } from '../types/game';
import { Trophy, Medal, Award, Play, Home } from 'lucide-react';

interface ResultProps {
  winner: Player;
  allPlayers: Player[];
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const Result = ({ winner, allPlayers, onPlayAgain, onBackToHome }: ResultProps) => {
  const sortedPlayers = [...allPlayers].sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold">{rank}</div>;
    }
  };

  const getPlayerColorClass = (playerId: number) => {
    const colors = ['player-1', 'player-2', 'player-3', 'player-4'];
    return colors[playerId] || 'player-1';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl space-y-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Winner Card */}
        <Card className={`gaming-card text-center ${getPlayerColorClass(winner.id)}`}>
          <CardHeader>
            <motion.div
              className="mx-auto mb-4"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-20 h-20 text-current" />
            </motion.div>
            
            <CardTitle className="text-4xl font-bold text-current">
              🎉 {winner.name} Wins! 🎉
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <motion.div
              className="text-6xl font-bold text-current mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {winner.score}
            </motion.div>
            <p className="text-xl text-current/80">Points</p>
          </CardContent>
        </Card>

        {/* Final Standings */}
        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Final Standings</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg gaming-card ${getPlayerColorClass(player.id)} ${
                    player.id === winner.id ? 'active-player' : ''
                  }`}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    {getRankIcon(index + 1)}
                    <span className="font-semibold text-lg text-current">
                      {player.name}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-xl text-current">
                      {player.score}
                    </div>
                    <div className="text-sm text-current/70">
                      points
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={onPlayAgain}
            className="w-full py-6 text-lg"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="w-full py-6 text-lg"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            New Game
          </Button>
        </div>

      </motion.div>
    </div>
  );
};