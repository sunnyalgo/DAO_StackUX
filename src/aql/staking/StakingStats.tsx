import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import Staking from '../lib/Staking.json';

export const StakingStats: React.FC = () => {
  const { chainId } = useWeb3React();
  const [ALT, setALT] = useState<number>(0);
  // const [TLA, setTLA] = useState();
  const [TAP, setTAP] = useState<number>(0);
  const [totalAQL, setTotalAQL] = useState<number>(0);

  useEffect(() => {
    if (chainId) getTotalAQL();
    getStakeStats();
  }, [chainId]);

  const getTotalAQL = async () => {
    if (chainId) {
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const contract = new ethers.Contract(
        Staking.address[chainId as unknown as keyof typeof Staking.address],
        Staking.abi,
        provider
      );
      const res = await contract.totalStaked();
      const res1 = res ? parseFloat(ethers.utils.formatEther(res)) : 0;
      setTotalAQL(res1);
    }
  };
  const getStakeStats = async () => {
    const { data: altData } = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/stake/averagelockedweeks`
    );
    setALT(altData);
    // const { data: tlaData } = await axios.get(
    //   `${process.env.NEXT_PUBLIC_SERVER_URL}/stake/totalamount`
    // );
    // setTLA(tlaData);
    const { data: tapData } = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/stake/totalap`
    );
    setTAP(tapData);
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      <span className="text-2xl font-bold mx-4">Staking Stats:</span>
      <div className="w-full flex space-x-4">
        <div className="w-80 shadow rounded-xl space-y-4 flex flex-col items-center justify-center border border-gray-main">
          <span className="text-lg font-semibold">APY</span>
          <span className="text-3xl font-bold text-blue-main">31.87%</span>
        </div>
        <div className="flex flex-wrap w-full space-y-4">
          <div className="flex w-full space-x-4">
            <div className="flex-1 shadow px-4 py-2 rounded-xl">
              <span className=" font-semibold">Average Lock Time:</span>
              <br />
              <span className="text-lg font-bold text-blue-main">{ALT.toFixed(0)}</span>
              <span className="text-gray-dark text-xs ml-2">Weeks</span>
            </div>
            <div className="flex-1 shadow px-4 py-2 rounded-xl">
              <span className=" font-semibold">Cumulative Pyout:</span>
              <br />
              <span className="text-lg font-bold text-blue-main">$98,765,432</span>
            </div>
          </div>
          <div className="flex w-full space-x-4">
            <div className="flex-1 shadow px-4 py-2 rounded-xl">
              <span className="font-semibold">Total AQL Locked:</span>
              <br />
              <span className="text-lg font-bold text-blue-main">
                {Intl.NumberFormat().format(totalAQL)}
              </span>
            </div>
            <div className="flex-1 shadow px-4 py-2 rounded-xl">
              <span className="font-semibold">Total AP:</span>
              <br />
              <span className="text-lg font-bold text-blue-main">
                {Intl.NumberFormat().format(TAP)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
