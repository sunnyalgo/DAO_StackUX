import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';

import { Account } from '../base/Account';
import { Loading } from '../base/Loading';
import { connectors } from '../lib/connectors';
import { LeftBar } from './LeftBar';

export const MainLayout: React.FC = ({ children }) => {
  const { activate } = useWeb3React();

  useEffect(() => {
    const connect = async () => {
      const connector = window.localStorage.getItem('connector');
      if (connector) {
        await activate(connectors[parseInt(connector) - 1].connector);
      }
    };
    connect();
  }, []);

  return (
    <div className="flex bg-white">
      <LeftBar />
      <div className="flex-1 flex flex-col ml-64 min-h-screen items-center">
        <div className="mt-8 w-full flex justify-end px-8">
          <Account />
        </div>
        <div className="flex-1 w-full flex items-center justify-center mt-8">{children}</div>
      </div>
      <Loading />
    </div>
  );
};
