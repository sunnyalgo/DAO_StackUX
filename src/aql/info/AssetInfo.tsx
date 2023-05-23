import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import styles from 'styles/Info.module.css';

const Revenue = [
  {
    title: '24h revenue',
    value: '$644.89',
  },
  {
    title: '7d revenue',
    value: '$4,514.12',
  },
  {
    title: '30d revenue',
    value: '$19,634.5',
  },
  {
    title: '365d revenue',
    value: '$253,123.15',
  },
];

export const AssetInfo: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-between space-y-4 md:space-y-0">
      <div className={styles.info__chart}>
        <span className="text-xl font-bold">Lending</span>
        <div className="w-full flex items-center justify-between pr-4">
          <span>Lending Supply: </span>
          <span className="text-blue-main font-semibold text-lg">$7,245,390</span>
        </div>
        <div className="w-full flex items-center justify-between pr-4">
          <span>Total Borrowed: </span>
          <span className="text-blue-main font-semibold text-lg">$5,289,134</span>
        </div>
        <div className="w-full border-t border-gray-main py-4">
          {Revenue.map((revenue, idx) => (
            <div className="w-full flex items-center justify-between pr-4" key={idx}>
              <span>{revenue.title}: </span>
              <span className="text-blue-main font-semibold text-lg">{revenue.value}</span>
            </div>
          ))}
        </div>
        <span>Estimated based on current utiliaztion</span>
      </div>
      <div className={styles.info__chart}>
        <span className="text-xl font-bold">Assets Utilization</span>
        <div className="w-60 h-60 flex p-6">
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
      </div>
    </div>
  );
};
