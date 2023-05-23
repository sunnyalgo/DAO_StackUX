/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { ethers } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';
import styles from 'styles/Staking.module.css';

import { Toggle } from '../base/Toggle';
import AQLToken from '../lib/AQLToken.json';
import StakingContract from '../lib/Staking.json';
import { hideLoading, showLoading } from '../lib/uiService';
import { StakeExtend } from './StakeExtend';
import { StakingInput } from './StakingInput';
import { Timer } from './Timer';
import { Withdraw } from './Withdraw';

export const StakingRewards: React.FC<any> = ({ stakeInfo }) => {
  const { account, chainId } = useWeb3React();
  const [showInput, setShowInput] = useState(false);
  const [showExtend, setShowExtend] = useState({ show: false, isMore: true });
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [stake, setStake] = useState(stakeInfo);
  const [userAQLBal, setUserAQLBal] = useState<number>(0);
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

  useEffect(() => {
    setStake(stakeInfo);
  }, [stakeInfo]);

  useEffect(() => {
    const getBalance = async () => {
      if (chainId && account) {
        const contract = new ethers.Contract(
          AQLToken.address[chainId as unknown as keyof typeof AQLToken.address],
          AQLToken.abi,
          provider
        );
        const res = await contract.balanceOf(account);
        const res1 = res ? parseFloat(ethers.utils.formatEther(res)) : 0;
        setUserAQLBal(res1);
      }
    };
    getBalance();
  }, [account, chainId]);

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

  const changeAutoExtended = async (autoExtended: boolean) => {
    showLoading();
    try {
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(
        StakingContract.address[chainId as unknown as keyof typeof StakingContract.address],
        StakingContract.abi,
        signer
      );
      autoExtended
        ? await contract.connect(signer).activateAutoExtending()
        : await contract.connect(signer).disableAutoExtending();
      contract.on('StakingChended', async (sender, amount, timelock, autoextended) => {
        await axios.put(
          `https://xea6c3rb2j.execute-api.us-east-1.amazonaws.com/dev/stake/${sender}`,
          {
            autoExtended: autoextended,
          }
        );
        setStake({ ...stake, autoextended });
        hideLoading();
        console.log(amount, timelock);
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
      hideLoading();
    }
  };

  const lockedDate: Date | null = useMemo(() => {
    return stake ? new Date(stake.timeLock * 1000) : null;
  }, [stake]);

  return (
    <>
      <div className="w-full flex flex-col space-y-4">
        <span className="text-2xl font-bold mx-4">Staking Rewards:</span>
        <div className="rounded-xl py-4 px-8 shadow border border-gray-main font-semibold text-lg text-gray-dark">
          <span>
            AQL tokens may be staked to earn a share of the protocol&#180;s revenue and access to
            voting rights in the DAO. Tokens may be staked for anywhere between 5 to 105 weeks. Each
            additional week staked gives the use an additional 2% AP.
          </span>
          <span className="text-blue-main mx-2 cursor-pointer">Learn more</span>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1 flex justify-between items-center p-8 shadow border border-gray-main rounded-xl">
            <div className="flex flex-col space-y-8 items-center">
              <span className="font-semibold text-xl">Rewards Earned:</span>
              <span className="font-bold text-blue-main text-4xl">
                ${Intl.NumberFormat().format(stake.reward)}
              </span>
              <button
                className="px-8 py-2 bg-blue-main rounded-lg text-white text-sm"
                disabled={stake.reward <= 0}
                onClick={handleWithdraw}
              >
                Claim All
              </button>
            </div>
            <div className="w-64 h080">
              <img src="/assets/Money.png" alt="Money" />
            </div>
          </div>
          <div
            className={`w-96 rounded-xl shadow border border-gray-main p-4 ${
              stake.amount > 0 ? 'space-y-2' : 'space-y-4'
            }`}
          >
            <div className="bg-gray-light px-4 py-2 border border-gray-main rounded-xl flex justify-between items-center">
              <span>Total AQL Balance</span>
              <span className="text-blue-main text-lg font-semibold">
                {Intl.NumberFormat().format(userAQLBal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>AQL Locked:</span>
              <span className="text-blue-main text-lg font-semibold">
                {stake.amount > 0 ? Intl.NumberFormat().format(stake.amount) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>AP:</span>
              <span className="text-blue-main text-lg font-semibold">
                {stake.amount > 0 ? Intl.NumberFormat().format(stake.reward) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Withdrawal Date:</span>
              <span className="text-blue-main text-lg font-semibold">
                {lockedDate && !stake.autoExtended && stake.amount > 0
                  ? lockedDate.toLocaleDateString('en-US')
                  : '--/--/----'}
              </span>
            </div>
            {stake.autoExtended ? (
              <div className="flex justify-between items-center">
                <span>Locked Time:</span>
                <span className="text-blue-main text-lg font-semibold">Auto Extending</span>
              </div>
            ) : (
              <Timer
                time={
                  stake.amount > 0 && lockedDate
                    ? (lockedDate as unknown as number) - Date.now()
                    : 0
                }
              />
            )}

            <div className="flex justify-between items-center">
              <span>Auto Extend:</span>
              <Toggle
                state={stake.autoExtended}
                onChange={changeAutoExtended}
                alert="Do want to change auto extended?"
              />
            </div>

            {stake.amount > 0 ? (
              <>
                <div className="px-4">
                  <button
                    className={styles.staking__button}
                    onClick={() => setShowExtend({ show: true, isMore: true })}
                  >
                    Stake More AQL
                  </button>
                </div>
                <div className="px-4">
                  <button
                    className={styles.staking__button}
                    onClick={() => setShowExtend({ show: true, isMore: false })}
                  >
                    Extend Staking
                  </button>
                </div>
                <div className="px-4">
                  <button className={styles.staking__button} onClick={() => setShowWithdraw(true)}>
                    Partial Withdraw
                  </button>
                </div>
                {lockedDate && (lockedDate as unknown as number) <= Date.now() && (
                  <div className="px-4">
                    <button
                      className={styles.staking__withdrawBtn}
                      onClick={() => handleWithdraw()}
                    >
                      Full Withdraw
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="px-4">
                <button className={styles.staking__button} onClick={() => setShowInput(true)}>
                  Create Lock
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <StakingInput isOpen={showInput} onClose={() => setShowInput(false)} bal={userAQLBal} />
      <StakeExtend
        isOpen={showExtend.show}
        onClose={() => setShowExtend({ show: false, isMore: true })}
        bal={userAQLBal}
        stakeInfo={stake}
        isMore={showExtend.isMore}
      />
      <Withdraw
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        bal={userAQLBal}
        stakeInfo={stake}
      />
    </>
  );
};
