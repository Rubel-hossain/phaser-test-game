import { useState, useCallback } from 'react';

export const useGameState = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = useCallback(() => {
    console.log('Starting game...');
    setIsPlaying(true);
  }, []);

  const endGame = useCallback(() => {
    console.log('Game ended');
    setIsPlaying(false);
  }, []);

  return { isPlaying, startGame, endGame };
};