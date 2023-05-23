import { faDiscord, faMedium, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from 'styles/LeftBar.module.css';

import AQL from '../assets/icon/aql.svg';
import Logo from '../assets/icon/logo.svg';

const MenuItems = [
  {
    title: 'Trade',
    link: '/trade',
    external: false,
  },
  {
    title: 'Liquidity',
    link: '/liquidity',
    external: false,
  },
  {
    title: 'Lending',
    link: '/lending',
    external: false,
  },
  {
    title: 'Stake',
    link: '/stake',
    external: false,
  },
  {
    title: 'Portfolio',
    link: '/portfolio',
    external: false,
  },
  {
    title: 'Forums',
    link: 'https://forum.aqualis.io/',
    external: true,
  },
  {
    title: 'Governance',
    link: 'https://snapshot.org/#/aqualisdao.eth',
    external: true,
  },
  {
    title: 'Info',
    link: '/info',
    external: false,
  },
];

export const LeftBar: React.FC = () => {
  const router = useRouter();
  const isActive = (link: string) => {
    return router.pathname === link;
  };

  return (
    <div className="h-screen fixed w-64 py-8 flex flex-col justify-between bg-gray-light">
      <Link href="/">
        <Logo width={180} height={80} className="cursor-pointer" alt="logo" />
      </Link>

      <div className="flex flex-col items-start px-8 space-y-3">
        {MenuItems.map((item, idx) =>
          item.external ? (
            <a href={item.link} key={idx} target="_blank" rel="noopener noreferrer">
              <button
                className={`${
                  isActive(item.link) ? styles.leftbar__link__active : styles.leftbar__link
                }`}
              >
                {item.title}
              </button>
            </a>
          ) : (
            <Link href={item.link} key={idx}>
              <button
                className={`${
                  isActive(item.link) ? styles.leftbar__link__active : styles.leftbar__link
                }`}
              >
                {item.title}
              </button>
            </Link>
          )
        )}
      </div>

      <div className="space-y-8 px-8">
        <div className="flex items-center justify-between">
          <AQL width={35} height={35} alt="aql" />
          <span className="text-xl">$0.76</span>
          <button className="rounded-lg bg-transparent border-2 border-blue-main px-4 text-blue-main">
            Buy
          </button>
        </div>
        <div className="space-x-6 flex justify-center">
          <a href="https://www.twitter.com/AqualisDAO" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} className="w-7 h-7 text-gray-dark" />
          </a>
          <a href="https://medium.com/aqualis" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faMedium} className="w-7 h-7 text-gray-dark" />
          </a>
          <a href="https://discord.com/invite/VTSjMnpsJP" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faDiscord} className="w-7 h-7 text-gray-dark" />
          </a>
        </div>
      </div>
    </div>
  );
};
