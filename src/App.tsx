import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import { Result } from "./pages/Result";
import { GameSettings, Player } from "./types/game";

const queryClient = new QueryClient();

type GameScreen = 'home' | 'game' | 'result';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [gameWinner, setGameWinner] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  const handleStartGame = (settings: GameSettings) => {
    setGameSettings(settings);
    setCurrentScreen('game');
  };

  const handleGameEnd = (winner: Player, players: Player[]) => {
    setGameWinner(winner);
    setAllPlayers(players);
    setCurrentScreen('result');
  };

  const handlePlayAgain = () => {
    setCurrentScreen('game');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setGameSettings(null);
    setGameWinner(null);
    setAllPlayers([]);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onStartGame={handleStartGame} />;
      
      case 'game':
        return gameSettings ? (
          <Game 
            settings={gameSettings}
            onGameEnd={(winner, players) => {
              handleGameEnd(winner, players);
            }}
            onRestart={handleBackToHome}
          />
        ) : (
          <Home onStartGame={handleStartGame} />
        );
      
      case 'result':
        return gameWinner && allPlayers.length > 0 ? (
          <Result
            winner={gameWinner}
            allPlayers={allPlayers}
            onPlayAgain={handlePlayAgain}
            onBackToHome={handleBackToHome}
          />
        ) : (
          <Home onStartGame={handleStartGame} />
        );
      
      default:
        return <Home onStartGame={handleStartGame} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {renderScreen()}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;