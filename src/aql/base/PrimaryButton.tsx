import { useCallback } from 'react';

type PrimaryButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onClick, disabled }) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <button
      className="w-full bg-blue-primary text-white text-base p-3 rounded-lg"
      onClick={handleClick}
      disabled={disabled ? disabled : false}
    >
      {label}
    </button>
  );
};
