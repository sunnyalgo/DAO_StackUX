import { Chart } from 'react-google-charts';
import styles from 'styles/Info.module.css';

import Statistics from '../assets/svg/Statistics.svg';
import { AQLStatus } from './AQLStatus';
import { AssetInfo } from './AssetInfo';

export const data = [
  ['Date', ''],
  [1, 0.25],
  [2, 0.9],
  [3, 2],
  [4, 1.7],
  [5, 1.9],
  [6, 1.8],
  [7, 2],
  [8, 2],
  [9, 1.9],
  [10, 1.8],
];

export const Info: React.FC = () => {
  return (
    <div className={styles.info}>
      <div className={styles.splash}>
        <div className="flex flex-col space-y-6 text-5xl font-bold text-white">
          <span>AQUALIS</span>
          <span>STATISTICS</span>
        </div>
        <Statistics width={420} height={200} alt="Statistics" />
      </div>
      <div className="flex flex-wrap justify-between space-y-4 md:space-y-0">
        <div className={styles.info__chart}>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold">Liquidity</span>
            <span className="text-lg font-semibold">$35,987,345.89</span>
          </div>
          <Chart
            chartType="Line"
            width="100%"
            height="200px"
            data={data}
            options={{ legend: { position: 'none' } }}
          />
        </div>
        <div className={styles.info__chart}>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold">Volume</span>
            <span className="text-lg font-semibold">$35,987,345.89</span>
          </div>
          <Chart
            chartType="AreaChart"
            width="100%"
            height="200px"
            data={data}
            options={{ legend: { position: 'none' } }}
          />
        </div>
      </div>
      <div className="rounded-xl shadow py-4 px-6 text-2xl flex justify-between items-center">
        <span className="rounded-xl shadow py-2 px-4 font-bold bg-gray-light">All-Time Volume</span>
        <span className="text-blue-main font-semibold">$100,789,234</span>
      </div>
      <div className="shadow rounded-xl border border-gray-main p-6 space-y-4">
        <span className="text-xl font-bold">Token Statics</span>
        <Chart
          chartType="Line"
          width="100%"
          height="250px"
          data={data}
          options={{ legend: { position: 'none' } }}
        />
      </div>
      <AQLStatus />
      <AssetInfo />
    </div>
  );
};
