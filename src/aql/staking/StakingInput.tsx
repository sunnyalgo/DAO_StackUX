/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import styles from 'styles/Staking.module.css';

import AQLToken from '../lib/AQLToken.json';
import StakingContract from '../lib/Staking.json';
import { hideLoading, showLoading } from '../lib/uiService';
import { InputAmount } from '../trade/InputAmount';

Modal.setAppElement('#__next');
const ApproveAmount = '9999999999999';

type StakingInputProps = {
  isOpen: boolean;
  onClose: () => void;
  bal: number;
};

export const StakingInput: React.FC<StakingInputProps> = ({ isOpen, onClose, bal }) => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
  const { account, chainId } = useWeb3React();
  const [amount, setAmount] = useState(0);
  const [weeks, setWeeks] = useState<number>();
  const [allowance, setAllowance] = useState<number>();

  useEffect(() => {
    const getAllowance = async () => {
      if (chainId && account) {
        const contract = new ethers.Contract(
          AQLToken.address[chainId as unknown as keyof typeof AQLToken.address],
          AQLToken.abi,
          provider
        );
        const res = await contract.allowance(
          account,
          StakingContract.address[chainId as unknown as keyof typeof AQLToken.address]
        );
        const res1 = res ? parseFloat(ethers.utils.formatEther(res)) : 0;
        setAllowance(res1);
      }
    };
    getAllowance();
  }, [account, chainId]);

  const handleChangeWeeks = (e: any) => {
    setWeeks(parseInt(e.target.value, 10));
  };

  const lockedDate = useMemo(() => {
    if (weeks) {
      let date = Date.now();
      date += weeks * 7 * 24 * 3600 * 1000;
      return new Date(date);
    } else return null;
  }, [weeks]);

  const approveAmount = async () => {
    showLoading();
    try {
      const amount = ethers.utils.parseEther(ApproveAmount);
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(
        AQLToken.address[chainId as unknown as keyof typeof AQLToken.address],
        AQLToken.abi,
        signer
      );
      const tx = await contract
        .connect(signer)
        .approve(
          StakingContract.address[chainId as unknown as keyof typeof StakingContract.address],
          amount
        );
      await tx.wait();
      hideLoading();
      const res = await contract.allowance(
        account,
        StakingContract.address[chainId as unknown as keyof typeof StakingContract.address]
      );
      const res1 = res ? parseFloat(ethers.utils.formatEther(res)) : 0;
      setAllowance(res1);
    } catch (e) {
      console.log(e);
      hideLoading();
    }
  };

  const handleStake = async () => {
    if (weeks && weeks < 5) {
      alert('Weeks should be above 5');
      return;
    }
    try {
      showLoading();
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(
        StakingContract.address[chainId as unknown as keyof typeof StakingContract.address],
        StakingContract.abi,
        signer
      );
      await contract.connect(signer).stake(ethers.utils.parseEther(amount.toString()), weeks);
      contract.on('Staked', async (sender, amount, left) => {
        await axios.post(`https://xea6c3rb2j.execute-api.us-east-1.amazonaws.com/dev/stake`, {
          address: sender,
          amount: parseFloat(ethers.utils.formatEther(left)),
          weeks: weeks,
        });
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
          <div className="font-bold mb-2">How much AQL would you like to lock?</div>
          <InputAmount value={amount} onChange={setAmount} max={bal} />
        </div>
        <div className={styles.divider} />
        <div>
          <div className="font-bold mb-2">How long would you like to lock for?</div>
          <label>Select between 5 to 105 weeks</label>
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
        <div className="font-bold">Summary</div>
        <div>
          <div className="flex justify-between items-center">
            <label>AQL to be locked:</label>
            <label>{Intl.NumberFormat().format(amount || 0)}</label>
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
          {amount && allowance && allowance >= amount ? (
            <button className={styles.staking__button} onClick={() => handleStake()}>
              Stake
            </button>
          ) : (
            <button className={styles.staking__button} onClick={() => approveAmount()}>
              Approve
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
