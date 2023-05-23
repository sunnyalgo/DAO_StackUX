/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import styles from 'styles/Portfolio.module.css';

import AQL from '../assets/icon/aql.png';
import { Timer } from '../staking/Timer';

type StakedProps = {
  symbol: any;
  balance?: number;
};
export const Staked: React.FC<StakedProps> = ({ symbol }) => {
  return (
    <div className={styles.staked__assets}>
      <span className="text-2xl font-semibold mb-4">{symbol} Staking</span>
      <div className="w-full flex justify-between items-center border border-gray-main rounded-xl px-4 py-2">
        <span>Total {symbol} Balance: </span>
        <span className="text-blue-main text-lg font-semibold">24,678</span>
      </div>

      <div className="w-full flex flex-col space-y-2 my-4">
        <div className="w-full flex justify-between items-center">
          <span>{symbol} Tokens Staked:</span>
          <span className="text-blue-main text-lg font-semibold">13,472($90,127.68)</span>
        </div>
        <div className="w-full flex justify-between items-center">
          <span>AP:</span>
          <span className="text-blue-main text-lg font-semibold">36,410</span>
        </div>
        <div className="w-full">
          <Timer time={0} />
        </div>
      </div>

      <div className="flex justify-between w-full items-start border-t border-gray-main py-2 my-2">
        <span>Pending {symbol} Rewards:</span>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <Image src={AQL} width={25} height={25} className="rounded-full" alt="aql" />
            <span>319.33</span>
            <span className="text-blue-main text-lg font-semibold">($2136.32)</span>
          </div>
          <button className="px-6 py-1 text-xs bg-blue-main text-white rounded-lg">Claim</button>
        </div>
      </div>
    </div>
  );
};
