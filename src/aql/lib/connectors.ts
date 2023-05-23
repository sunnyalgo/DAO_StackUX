import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const Wallet_Connect = new WalletConnectConnector({
  supportedChainIds: [1, 5],
  rpc: {
    1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
    5: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});

const Injected = new InjectedConnector({
  supportedChainIds: [1, 5],
});

export const connectors = [
  {
    title: 'Metamask',
    icon: '/assets/icon/metamaskWallet.png',
    connector: Injected,
    priority: 1,
  },
  {
    title: 'WalletConnect',
    icon: '/assets/icon/wallet-connect.png',
    connector: Wallet_Connect,
    priority: 2,
  },
  {
    title: 'Trust Wallet',
    icon: '/assets/icon/TrustWallet.png',
    connector: Injected,
    priority: 3,
  },
  {
    title: 'MathWallet',
    icon: '/assets/icon/MathWallet.png',
    connector: Injected,
    priority: 999,
  },
  {
    title: 'TokenPocket',
    icon: '/assets/icon/TokenPocket.png',
    connector: Injected,
    priority: 999,
  },
  {
    title: 'SafePal',
    icon: '/assets/icon/SafePal.png',
    connector: Injected,
    priority: 999,
  },
  {
    title: 'Coin98',
    icon: '/assets/icon/Coin98.png',
    connector: Injected,
    priority: 999,
  },
];
