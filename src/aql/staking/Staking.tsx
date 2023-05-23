/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';
import styles from 'styles/Staking.module.css';

// import AQLToken from '../lib/AQLToken.json';
import AQTTransfer from '../lib/AQTTransfer.json';
import StakingContract from '../lib/Staking.json';
import { hideLoading, showLoading } from '../lib/uiService';
import { StakingRewards } from './StakingRewards';
import { StakingStats } from './StakingStats';

export const Staking: React.FC = () => {
  const { account, chainId } = useWeb3React();
  const [stakeInfo, setStakeInfo] = useState<any>();
  const [reward, setReward] = useState();

  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

  useEffect(() => {
    const getInfo = async () => {
      if (account && chainId) {
        const contract = new ethers.Contract(
          StakingContract.address[chainId as unknown as keyof typeof StakingContract.address],
          StakingContract.abi,
          provider
        );
        const res = await contract.getStakeInfo(account);
        setStakeInfo(res);
        const res1 = await contract.calculateReward(account);
        setReward(res1);
        // const contract1 = new ethers.Contract(
        //   AQLToken.address[chainId as unknown as keyof typeof AQLToken.address],
        //   AQLToken.abi,
        //   provider
        // );
        // const res2 = await contract1.allowance(
        //   account,
        //   StakingContract.address[chainId as unknown as keyof typeof StakingContract.address]
        // );
        // setAllowance(res2);
      }
    };
    getInfo();
  }, [account, chainId]);

  const getStakeInfo = useMemo(() => {
    const info: any = {};
    if (stakeInfo) {
      info.amount = parseFloat(ethers.utils.formatEther(stakeInfo.amount));
      info.timeLock = stakeInfo.timeLock.toNumber();
      info.autoExtended = stakeInfo.autoExtended;
    }
    if (reward) {
      info.reward = parseFloat(ethers.utils.formatEther(reward));
    }
    return info;
  }, [stakeInfo, reward]);

  const getAQT = async () => {
    showLoading();
    try {
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(
        AQTTransfer.address[chainId as unknown as keyof typeof AQTTransfer.address],
        AQTTransfer.abi,
        signer
      );
      const tx = await contract.connect(signer).claimAQT();
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
    hideLoading();
  };

  return (
    <div className={styles.staking}>
      <StakingStats />
      <StakingRewards stakeInfo={getStakeInfo} />
      <button
        className="border border-gray-dark rounded-lg p-2 w-64 mx-auto"
        onClick={() => getAQT()}
      >
        Get AQL
      </button>
    </div>
  );
};
