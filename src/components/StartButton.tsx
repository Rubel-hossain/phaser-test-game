import { buttonConfig } from '../config/button-config';

interface StartButtonProps {
  onClick: () => void;
}

export const StartButton = ({ onClick }: StartButtonProps) => {
  const { buttonText, buttonStyle } = buttonConfig;

  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 z-20 transition-all hover:opacity-90 active:scale-95"
      style={{
        ...buttonStyle,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {buttonText}
    </button>
  );
};