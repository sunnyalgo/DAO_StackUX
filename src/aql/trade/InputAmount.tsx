/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from 'styles/Trade.module.css';

type InputAmountProps = {
  value: number | undefined;
  onChange: (val: number) => void;
  max: number;
  className?: string;
};
export const InputAmount: React.FC<InputAmountProps> = ({ value, onChange, max, className }) => {
  const handleChange = (e: any) => {
    const amount = e.target.value;
    onChange(Math.abs(parseFloat(amount)));
  };
  return (
    <div className={className}>
      <span className="text-sm">Total Amount</span>
      <div className="flex items-center justify-between bg-gray-light shadow rounded-lg py-2">
        <input
          type="number"
          className={styles.inputAmount__input}
          value={value}
          onChange={handleChange}
        />
        <button className="text-sm bg-white rounded-lg p-2 mx-2" onClick={() => onChange(max)}>
          MAX
        </button>
      </div>
    </div>
  );
};
