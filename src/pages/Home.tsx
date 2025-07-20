import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { GameSettings } from '../types/game';
import { HelpCircle, Users, Timer, Play } from 'lucide-react';

interface HomeProps {
  onStartGame: (settings: GameSettings) => void;
}

export const Home = ({ onStartGame }: HomeProps) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [turnDuration, setTurnDuration] = useState(30);
  const [targetScore, setTargetScore] = useState(100);

  const handlePlayerCountChange = (count: number) => {
    setNumberOfPlayers(count);
    const newNames = Array.from({ length: count }, (_, i) => 
      playerNames[i] || `Player ${i + 1}`
    );
    setPlayerNames(newNames);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const settings: GameSettings = {
      numberOfPlayers,
      playerNames,
      timerEnabled,
      turnDuration,
      targetScore,
    };
    onStartGame(settings);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="gaming-card">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto mb-4 w-16 h-16 bg-card border-2 border-border rounded-lg shadow-lg flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-3 h-3 bg-foreground rounded-full" />
            </motion.div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PIG Dice Game
            </CardTitle>
            <CardDescription>
              Roll the dice, first player to reach the target score wins!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Number of Players */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Players
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((count) => (
                  <Button
                    key={count}
                    variant={numberOfPlayers === count ? "default" : "outline"}
                    onClick={() => handlePlayerCountChange(count)}
                    className="w-full"
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>

            {/* Player Names */}
            <div className="space-y-3">
              <Label>Player Names</Label>
              {playerNames.map((name, index) => (
                <Input
                  key={index}
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className={`player-${index + 1}`}
                />
              ))}
            </div>

            {/* Target Score */}
            <div className="space-y-3">
              <Label>Target Score to Win</Label>
              <div className="grid grid-cols-2 gap-2">
                {[50, 100].map((score) => (
                  <Button
                    key={score}
                    variant={targetScore === score ? "default" : "outline"}
                    onClick={() => setTargetScore(score)}
                    className="w-full"
                  >
                    {score} Points
                  </Button>
                ))}
              </div>
            </div>

            {/* Timer Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Turn Timer
                </Label>
                <Switch
                  checked={timerEnabled}
                  onCheckedChange={setTimerEnabled}
                />
              </div>
              
              {timerEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label>Turn Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={turnDuration}
                    onChange={(e) => setTurnDuration(Number(e.target.value))}
                    min={10}
                    max={120}
                  />
                </motion.div>
              )}
            </div>

            {/* Start Game Button */}
            <Button 
              onClick={handleStartGame}
              className="w-full text-lg py-6"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>

            {/* Game Rules */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  How to Play
                </Button>
              </DialogTrigger>
              <DialogContent className="gaming-card max-w-md">
                <DialogHeader>
                  <DialogTitle>How to Play PIG</DialogTitle>
                  <DialogDescription className="text-left space-y-3">
                    <p><strong>Goal:</strong> Be the first player to reach the target score.</p>
                    
                    <p><strong>On Your Turn:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Roll the dice and add points to your turn score</li>
                      <li>Keep rolling to increase your turn score</li>
                      <li><strong>Or,</strong> You can "Hold" to keep your current turn's score</li>
                    </ul>
                    
                    <p><strong>Warning:</strong> If you roll a 1, you lose all points from that turn and your turn ends!</p>
                    
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};