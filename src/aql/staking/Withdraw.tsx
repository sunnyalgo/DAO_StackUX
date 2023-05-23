/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import styles from 'styles/Staking.module.css';

import StakingContract from '../lib/Staking.json';
import { hideLoading, showLoading } from '../lib/uiService';
import { InputAmount } from '../trade/InputAmount';

type WithdrawProps = {
  isOpen: boolean;
  onClose: () => void;
  bal: number;
  stakeInfo: any;
};
export const Withdraw: React.FC<WithdrawProps> = ({ isOpen, onClose, bal, stakeInfo }) => {
  const { account, chainId } = useWeb3React();
  const [amount, setAmount] = useState(0);
  const [weeksUnstake, setWeeksUnstake] = useState<number>();

  useEffect(() => {
    const getWeeksUnstake = async () => {
      if (chainId && account) {
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new ethers.Contract(
          StakingContract.address[chainId as unknown as keyof typeof StakingContract.address],
          StakingContract.abi,
          provider
        );
        const res = await contract.weeksForUnstake(account);
        const res1 = res ? parseFloat(ethers.utils.formatEther(res)) : 0;
        setWeeksUnstake(res1);
      }
    };
    getWeeksUnstake();
  }, [account, chainId]);

  const penalty = useMemo(() => {
    if (weeksUnstake && amount) {
      const percent = weeksUnstake * 0.003 + 0.01;
      return amount * percent;
    } else return 0;
  }, [weeksUnstake, amount]);

  const lockedDate: Date = useMemo(() => {
    const date = stakeInfo ? stakeInfo.timeLock * 1000 : Date.now();
    return new Date(date);
  }, [stakeInfo]);

  const disableWithdraw = useMemo(() => {
    if (stakeInfo && stakeInfo.amount <= 0) return true;
    if (stakeInfo && new Date(stakeInfo.timeLock * 1000) !== new Date()) return true;
  }, [stakeInfo]);

  const handleWithdraw = async () => {
    showLoading();
    try {
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(
        StakingContract.address[chainId as unknown as keyof typeof StakingContract.address],
        StakingContract.abi,
        signer
      );
      await contract.connect(signer).unstakeAll();
      contract.on('Unstaked', async (sender, amount, left) => {
        await axios.put(
          `https://xea6c3rb2j.execute-api.us-east-1.amazonaws.com/dev/stake/${sender}`,
          {
            amount: parseFloat(ethers.utils.formatEther(left)),
            weeks: 0,
          }
        );
        hideLoading();
        console.log(amount);
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
      hideLoading();
    }
  };

  const handleWithdrawPartial = async () => {
    showLoading();
    try {
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(
        StakingContract.address[chainId as unknown as keyof typeof StakingContract.address],
        StakingContract.abi,
        signer
      );
      await contract.connect(signer).unstake(ethers.utils.parseEther(amount.toString()));
      contract.on('Unstaked', async (sender, amount, left) => {
        await axios.put(
          `https://xea6c3rb2j.execute-api.us-east-1.amazonaws.com/dev/stake/${sender}`,
          {
            amount: parseFloat(ethers.utils.formatEther(left)),
          }
        );
        hideLoading();
        console.log(amount);
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
      hideLoading();
    }
  };

  const handleWithdrawPenalty = async () => {
    showLoading();
    try {
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(
        StakingContract.address[chainId as unknown as keyof typeof StakingContract.address],
        StakingContract.abi,
        signer
      );
      await contract.connect(signer).unstakeWithPenalty(ethers.utils.parseEther(amount.toString()));
      contract.on('Unstaked', async (sender, amount, left) => {
        await axios.put(
          `https://xea6c3rb2j.execute-api.us-east-1.amazonaws.com/dev/stake/${sender}`,
          {
            amount: parseFloat(ethers.utils.formatEther(left)),
          }
        );
        hideLoading();
        console.log(amount);
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
      hideLoading();
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
      <div className="w-80 space-y-4">
        <div>
          <div className="font-bold mb-2">Withdraw AQL tokens</div>
          <InputAmount value={amount} onChange={setAmount} max={stakeInfo.amount} />
          <span>{`Your Penalty: ${penalty}`}</span>
        </div>
        <div className={styles.divider} />
        <div className="font-bold">Summary</div>
        <div>
          <div className="flex justify-between items-center">
            <label>AQL to be locked:</label>
            <label>{Intl.NumberFormat().format(stakeInfo.amount - amount)}</label>
          </div>
          <div className="flex justify-between items-center">
            <label>AQL balance:</label>
            <label>{Intl.NumberFormat().format(bal + amount)}</label>
          </div>
          <div className="flex justify-between items-center">
            <label>APR:</label>
            <label>0</label>
          </div>
          <div className="flex justify-between items-center">
            <label>Unlock date:</label>
            <label>{lockedDate ? lockedDate.toLocaleDateString('en-US') : '--/--/----'}</label>
          </div>
        </div>
        <div className="space-y-2">
          <button className={styles.staking__button} onClick={() => handleWithdrawPenalty()}>
            Withdraw with Penalty
          </button>
          {(lockedDate as unknown as number) <= Date.now() && (
            <button className={styles.staking__button} onClick={() => handleWithdrawPartial()}>
              Partial Withdraw
            </button>
          )}
          {(lockedDate as unknown as number) <= Date.now() && (
            <button
              className={styles.staking__button}
              onClick={() => handleWithdraw()}
              disabled={disableWithdraw}
            >
              Full Withdraw
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
