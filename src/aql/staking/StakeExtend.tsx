/* eslint-disable @typescript-eslint/no-explicit-any */

import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { ethers } from 'ethers';
import { useMemo, useState } from 'react';
import Modal from 'react-modal';
import styles from 'styles/Staking.module.css';

import StakingContract from '../lib/Staking.json';
import { hideLoading, showLoading } from '../lib/uiService';
import { InputAmount } from '../trade/InputAmount';

type StakeExtendProps = {
  isOpen: boolean;
  onClose: () => void;
  bal: number;
  stakeInfo: any;
  isMore: boolean;
};
export const StakeExtend: React.FC<StakeExtendProps> = ({
  isOpen,
  onClose,
  bal,
  stakeInfo,
  isMore,
}) => {
  const { chainId } = useWeb3React();
  const [amount, setAmount] = useState<number>();
  const [weeks, setWeeks] = useState<number>();
  const handleChangeWeeks = (e: any) => {
    setWeeks(parseInt(e.target.value, 10));
  };

  const lockedDate = useMemo(() => {
    let date = stakeInfo ? stakeInfo.timeLock * 1000 : Date.now();
    date += weeks ? weeks * 7 * 24 * 3600 * 1000 : 0;
    return new Date(date);
  }, [weeks, stakeInfo]);

  const handleIncreaseStakingAmount = async () => {
    showLoading();
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum || window.web3.currentProvider
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        StakingContract.address[chainId as unknown as keyof typeof StakingContract.address],
        StakingContract.abi,
        signer
      );
      await contract
        .connect(signer)
        .increaseStakingAmount(ethers.utils.parseEther((amount || 0).toString()));
      contract.on('StakingChended', async (sender, amount, timelock, autoextended) => {
        await axios.put(
          `https://xea6c3rb2j.execute-api.us-east-1.amazonaws.com/dev/stake/${sender}`,
          {
            amount: parseFloat(ethers.utils.formatEther(amount)),
            autoExtended: autoextended,
          }
        );
        hideLoading();
        console.log(timelock);
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
      hideLoading();
    }
  };

  const handleExtend = async () => {
    showLoading();
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum || window.web3.currentProvider
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        StakingContract.address[chainId as unknown as keyof typeof StakingContract.address],
        StakingContract.abi,
        signer
      );
      await contract.connect(signer).extendStaking(weeks);
      contract.on('StakingChended', async (sender, amount, timelock, autoextended) => {
        await axios.put(
          `https://xea6c3rb2j.execute-api.us-east-1.amazonaws.com/dev/stake/${sender}`,
          {
            weeks: weeks,
            amount: parseFloat(ethers.utils.formatEther(amount)),
            autoExtended: autoextended,
          }
        );
        hideLoading();
        console.log(timelock);
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
        {isMore && (
          <>
            <div>
              <div className="font-bold mb-2">How much would you like to increase?</div>
              <InputAmount value={amount} onChange={setAmount} max={bal} />
            </div>
            <div className={styles.divider} />
          </>
        )}
        {!isMore && (
          <>
            <div>
              <div className="font-bold mb-2">How long would you like to extend?</div>
              <input
                type="number"
                placeholder="Number of Weeks"
                className={styles.input}
                value={weeks}
                onChange={handleChangeWeeks}
              />
              {weeks && weeks >= 105 && <label>Please note your stake will auto-extend</label>}
            </div>
            <div className={styles.divider} />
          </>
        )}
        <div className="font-bold">Summary</div>
        <div>
          <div className="flex justify-between items-center">
            <label>AQL to be locked:</label>
            <label>{Intl.NumberFormat().format(stakeInfo.amount + (amount || 0))}</label>
          </div>
          <div className="flex justify-between items-center">
            <label>AQL balance:</label>
            <label>{Intl.NumberFormat().format(bal - (amount || 0))}</label>
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
        <div>
          {isMore ? (
            <button
              className={styles.staking__button}
              onClick={() => handleIncreaseStakingAmount()}
            >
              Stake
            </button>
          ) : (
            <button className={styles.staking__button} onClick={() => handleExtend()}>
              Submit
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
