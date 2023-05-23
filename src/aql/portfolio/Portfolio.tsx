import 'react-circular-progressbar/dist/styles.css';

import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import styles from 'styles/Portfolio.module.css';

import AqualisTokens from '../lib/AqualisTokens.json';
import { Assets } from './Assets';
import { Staked } from './Staked';

const DepositAssets = [
  {
    token: AqualisTokens.usdt,
    apy: 5.4834,
    balance: 0,
    increase: true,
  },
  {
    token: AqualisTokens.usdc,
    apy: 5.0974,
    balance: 0,
    increase: true,
  },
];

const BorrowAssets = [
  {
    token: AqualisTokens.usdt,
    apy: 1.0749,
    balance: 0,
    increase: false,
  },
  {
    token: AqualisTokens.usdc,
    apy: 0.2749,
    balance: 0,
    increase: false,
  },
];

export const Portfolio: React.FC = () => {
  return (
    <div className={styles.portfolio}>
      <div className={styles.portfolio__assets}>
        <div className="flex flex-col items-center text-xl font-bold space-y-6">
          <span>Total Assets</span>
          <span className="rounded-xl px-16 py-2 border-2 border-gray-main">$23,549.23</span>
        </div>
        <div className="w-48 h-48">
          <CircularProgressbar
            value={100 - 73}
            text={`${73}%`}
            strokeWidth={4}
            styles={buildStyles({
              textColor: 'black',
              pathColor: 'red',
              trailColor: 'green',
            })}
          />
        </div>
        <div className="flex flex-col items-center text-xl font-bold space-y-6">
          <span>Total Liabilities</span>
          <span className="rounded-xl px-16 py-2 border-2 border-gray-main">$12,3939.29</span>
        </div>
      </div>

      <span className={styles.portfolio__title}>Lending:</span>
      <div className="flex flex-wrap justify-between space-y-4 md:space-y-0">
        <Assets title="Deposit" assets={DepositAssets} />
        <Assets title="Borrow" assets={BorrowAssets} />
      </div>

      <div className="flex items-center space-x-2">
        <span className={styles.portfolio__title}>Staking Rewards:</span>
        <button className="bg-black px-6 py-2 rounded-2xl text-xs text-white mt-2 shadow">
          CLAIM ALL
        </button>
      </div>

      <div className="flex flex-wrap justify-between space-y-4 md:space-y-0">
        <Staked symbol="AQL" />
        <Staked symbol="MALP" />
      </div>
    </div>
  );
};
