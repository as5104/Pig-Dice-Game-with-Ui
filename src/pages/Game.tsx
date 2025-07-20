import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dice } from '../components/Dice';
import { Scoreboard } from '../components/Scoreboard';
import { TurnIndicator } from '../components/TurnIndicator';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { GameState, GameSettings, Player } from '../types/game';
import { RotateCcw } from 'lucide-react';

interface GameProps {
  settings: GameSettings;
  onGameEnd: (winner: Player, players: Player[]) => void;
  onRestart: () => void;
}

export const Game = ({ settings, onGameEnd, onRestart }: GameProps) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const players = settings.playerNames.map((name, index) => ({
      id: index,
      name,
      score: 0,
      color: `hsl(var(--player-${index + 1}))`
    }));

    return {
      players,
      currentPlayerIndex: 0,
      currentScore: 0,
      diceValue: 1,
      isRolling: false,
      gameWinner: null,
      turnTimeLeft: settings.timerEnabled ? settings.turnDuration : undefined,
      timerEnabled: settings.timerEnabled,
      turnDuration: settings.turnDuration,
    };
  });

  // Timer logic
  useEffect(() => {
    if (!gameState.timerEnabled || gameState.gameWinner || gameState.turnTimeLeft === undefined) {
      return;
    }

    if (gameState.turnTimeLeft <= 0) {
      handleHold();
      return;
    }

    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        turnTimeLeft: prev.turnTimeLeft ? prev.turnTimeLeft - 1 : 0
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.turnTimeLeft, gameState.timerEnabled, gameState.gameWinner]);


  const rollDice = useCallback(() => {
    if (gameState.isRolling || gameState.gameWinner) return;

    setGameState(prev => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      
      setGameState(prev => {
        if (newValue === 1) {
          const nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
          return {
            ...prev,
            diceValue: newValue,
            isRolling: false,
            currentScore: 0,
            currentPlayerIndex: nextPlayerIndex,
            turnTimeLeft: prev.timerEnabled ? prev.turnDuration : undefined,
          };
        } else {
          return {
            ...prev,
            diceValue: newValue,
            isRolling: false,
            currentScore: prev.currentScore + newValue,
          };
        }
      });
    }, 600);
  }, [gameState.isRolling, gameState.gameWinner]);

  const handleHold = useCallback(() => {
    if (gameState.isRolling || gameState.gameWinner) return;

    
    
    setGameState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex].score += prev.currentScore;
      
      const winner = newPlayers[prev.currentPlayerIndex].score >= settings.targetScore 
        ? newPlayers[prev.currentPlayerIndex] 
        : null;

      if (winner) {
        setTimeout(() => onGameEnd(winner, newPlayers), 2000);
      }

      const nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      
      return {
        ...prev,
        players: newPlayers,
        currentScore: 0,
        currentPlayerIndex: winner ? prev.currentPlayerIndex : nextPlayerIndex,
        gameWinner: winner,
        turnTimeLeft: prev.timerEnabled && !winner ? prev.turnDuration : undefined,
      };
    });
  }, [gameState.isRolling, gameState.gameWinner, onGameEnd, settings.targetScore]);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center space-y-6">
      <ConfettiEffect 
        isActive={!!gameState.gameWinner}
        playerColor={currentPlayer.color}
      />
      
      {/* Header Controls */}
      <div className="flex justify-between items-center w-full max-w-4xl">
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Target: {settings.targetScore} points
        </div>
      </div>

      {/* Turn Indicator */}
      {!gameState.gameWinner && (
        <TurnIndicator
          currentPlayer={currentPlayer}
          currentPlayerIndex={gameState.currentPlayerIndex}
          timeLeft={gameState.turnTimeLeft}
          timerEnabled={gameState.timerEnabled}
        />
      )}

      {/* Win Message */}
      {gameState.gameWinner && (
        <motion.div
          className="gaming-card p-8 text-center max-w-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <h2 className="text-4xl font-bold mb-4 text-primary">
            🎉 {gameState.gameWinner.name} Wins! 🎉
          </h2>
          <p className="text-xl text-muted-foreground">
            Final Score: {gameState.gameWinner.score} points
          </p>
        </motion.div>
      )}

      {/* Scoreboard */}
      <Scoreboard 
        players={gameState.players}
        currentPlayerIndex={gameState.currentPlayerIndex}
        currentScore={gameState.currentScore}
        targetScore={settings.targetScore}
      />

      {/* Game Area */}
      {!gameState.gameWinner && (
        <motion.div
          className="gaming-card p-8 text-center max-w-md w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-6">
            {/* Dice */}
            <Dice 
              value={gameState.diceValue}
              isRolling={gameState.isRolling}
            />

            {/* Current Score */}
            <motion.div
              className="text-center"
              animate={{ scale: gameState.currentScore > 0 ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm text-muted-foreground">Turn Score</div>
              <div className="text-3xl font-bold text-primary">
                {gameState.currentScore}
              </div>
            </motion.div>

            {/* Game Controls */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={rollDice}
                disabled={gameState.isRolling}
                className="w-full py-6 text-lg"
                variant="default"
              >
                {gameState.isRolling ? 'Rolling...' : 'Roll Dice'}
              </Button>
              
              <Button
                onClick={handleHold}
                disabled={gameState.isRolling || gameState.currentScore === 0}
                className="w-full py-6 text-lg"
                variant="secondary"
              >
                Hold
              </Button>
            </div>

            {/* Game Tip */}
            {gameState.diceValue === 1 && !gameState.isRolling && (
              <motion.div
                className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Oops! You rolled a 1. Your turn is over and you lose your turn score.
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};