/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from 'styles/Lending.module.css';

type AssetsProps = {
  title: string;
  assets: any[];
};
export const Assets: React.FC<AssetsProps> = ({ title, assets }) => {
  return (
    <div className={styles.assets}>
      <span className={styles.assets__title}>{title}</span>
      <div className="flex items-center py-2 w-full">
        <span className={styles.assets__cell}>Asset</span>
        <span className={styles.assets__cell}>APY</span>
        <span className={styles.assets__cell}>
          Your
          <br />
          Balance
        </span>
      </div>
      {assets.map((asset, idx) => (
        <div key={idx} className="flex items-center w-full border-t border-gray-main py-8">
          <div className={styles.assets__cell}>
            <div className="w-full px-4 space-x-4 flex items-center">
              <img
                src={asset.token.logoURI}
                className="w-10 h-10 rounded-full"
                alt={asset.token.symbol}
              />
              <span className="font-semibold">{asset.token.symbol}</span>
            </div>
          </div>
          <div className={styles.assets__cell}>
            {asset.increase && <span className="text-green-main"> + {asset.apy}%</span>}
            {!asset.increase && <span className="text-red-main"> - {asset.apy}%</span>}
          </div>
          <span className={styles.assets__cell}>
            {asset.balance} {asset.token.symbol}
          </span>
        </div>
      ))}
    </div>
  );
};
