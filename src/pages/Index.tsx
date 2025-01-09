import { Game } from '../components/Game';
import { StartButton } from '../components/StartButton';
import { useGameState } from '../hooks/useGameState';

const Index = () => {
  const { isPlaying, startGame, endGame } = useGameState();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Game isPlaying={isPlaying} onGameEnd={endGame} />
      {!isPlaying && <StartButton onClick={startGame} />}
    </div>
  );
};

export default Index;