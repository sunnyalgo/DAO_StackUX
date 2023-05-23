/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';
import styles from 'styles/Liquidity.module.css';

import { Account } from '../base/Account';
import { Card } from '../base/Card';
import { PrimaryButton } from '../base/PrimaryButton';
import AQLDAI from '../lib/AQLDAI.json';
import AQLMALP from '../lib/AQLMALP.json';
import AQLUSDC from '../lib/AQLUSDC.json';
import AQLUSDT from '../lib/AQLUSDT.json';
import AQTTransfer from '../lib/AQTTransfer.json';
import AqualisTokens from '../lib/AqualisTokens.json';
import StableLP from '../lib/StableLP.json';
import { hideLoading, showLoading } from '../lib/uiService';
import TokenMenu from './TokenMenu';

const ApproveAmount = '9999999999999';
const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

export const Liquidity: React.FC = () => {
  const { active, account, chainId: initChainId } = useWeb3React();
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [isApprovedFrom, setApprovedFrom] = useState(false);
  const [isApprovedTo, setApprovedTo] = useState(false);
  const [userFromBalance, setUserFromBalance] = useState<number>(0);
  const [liquidityFromBalance, setLiquidityFromBalance] = useState<number>(0);
  const [userToBalance, setUserToBalance] = useState<number>(0);
  const [liquidityToBalance, setLiquidityToBalance] = useState<number>(0);
  const [userMalpBalance, setUserMalpBalance] = useState<number>(0);
  const [fromToken, setFromToken] = useState(Object.values(AqualisTokens)[0]);
  const [toToken, setToToken] = useState(Object.values(AqualisTokens)[1]);
  const [fromAllowance, setFromAllowance] = useState<number>(0);
  const [toAllowance, setToAllowance] = useState<number>(0);

  useEffect(() => {
    const amount = fromAmount || 0;
    if (fromAllowance > amount) setApprovedFrom(true);
    else setApprovedFrom(false);
  }, [fromAllowance, fromAmount, fromToken]);

  useEffect(() => {
    const amount = toAmount || 0;
    if (toAllowance > amount) setApprovedTo(true);
    else setApprovedTo(false);
  }, [toAllowance, toAmount, toToken]);

  const getBalance = async (conAddress: string, abi: any, acc: string) => {
    try {
      const contract = new ethers.Contract(conAddress, abi, provider);
      const balance = await contract.balanceOf(acc);
      return balance ? parseFloat(ethers.utils.formatEther(balance)) : 0;
    } catch (error) {
      console.log(error);
    }
  };

  const chainId = useMemo(() => {
    if (initChainId) return initChainId as unknown as keyof typeof StableLP.address;
    else '5';
  }, [initChainId]);

  useEffect(() => {
    const getFromBal = async () => {
      if (fromToken && account) {
        const res = await getBalance(fromToken.address, AQLDAI.abi, account);
        setUserFromBalance(res || 0);
      }
      if (fromToken && chainId) {
        const res = await getBalance(fromToken.address, AQLDAI.abi, StableLP.address[chainId]);
        setLiquidityFromBalance(res || 0);
      }
    };
    getFromBal();
  }, [fromToken, account, chainId]);

  useEffect(() => {
    const getToBal = async () => {
      if (toToken && account) {
        const res = await getBalance(toToken.address, AQLDAI.abi, account);
        setUserToBalance(res || 0);
      }
      if (toToken && chainId && account) {
        const res = await getBalance(toToken.address, AQLDAI.abi, StableLP.address[chainId]);
        setLiquidityToBalance(res || 0);
        const res1 = await getBalance(AQLMALP.address[chainId], AQLMALP.abi, account);
        setUserMalpBalance(res1 || 0);
      }
    };
    getToBal();
  }, [toToken, account, chainId]);

  useEffect(() => {
    const handleAllowance = async () => {
      if (fromToken) {
        const res = await getAllowance(AQLDAI.abi, fromToken.address);
        setFromAllowance(res || 0);
      }
      if (toToken && chainId) {
        const res = await getAllowance(AQLDAI.abi, AQLMALP.address[chainId]);
        setToAllowance(res || 0);
      }
    };
    handleAllowance();
  }, [fromToken, toToken, account, chainId]);

  const getAllowance = async (abi: any, conAddress: string) => {
    if (!chainId) return;
    try {
      const contract = new ethers.Contract(conAddress, abi, provider);
      const allowing = await contract.allowance(account, StableLP.address[chainId]);
      return allowing ? parseFloat(ethers.utils.formatEther(allowing)) : 0;
    } catch (error) {
      console.log(error);
    }
  };

  const approveFromAmount = async () => {
    if (!chainId) return;
    showLoading();
    try {
      const amount = ethers.utils.parseEther(ApproveAmount);
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(fromToken.address, AQLDAI.abi, signer);
      const tx = await contract.connect(signer).approve(StableLP.address[chainId], amount);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
    hideLoading();
  };

  const approveToAmount = async () => {
    if (!chainId) return;
    showLoading();
    try {
      const amount = ethers.utils.parseEther(ApproveAmount);
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(AQLMALP.address[chainId], AQLDAI.abi, signer);
      const tx = await contract.connect(signer).approve(StableLP.address[chainId], amount);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
    hideLoading();
  };

  const deposit = async () => {
    if (!chainId) return;
    showLoading();
    try {
      if (fromAmount > userFromBalance) {
        alert('Not enough balance!');
      } else {
        const amount = ethers.utils.parseEther(fromAmount.toString());
        const pro = new ethers.providers.Web3Provider(
          window.ethereum || window.web3.currentProvider
        );
        const signer = pro.getSigner();
        const contract = new ethers.Contract(StableLP.address[chainId], StableLP.abi, signer);
        const tx = await contract.connect(signer).createMALP(fromToken.address, amount);
        await tx.wait();
        setApprovedFrom(false);
        hideLoading();
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
      hideLoading();
    }
  };

  const withdraw = async () => {
    if (!chainId) return;
    showLoading();
    try {
      if (toAmount > userMalpBalance) {
        alert('Not enough balance!');
      } else {
        const amount = ethers.utils.parseEther(toAmount.toString());
        const pro = new ethers.providers.Web3Provider(
          window.ethereum || window.web3.currentProvider
        );
        const signer = pro.getSigner();
        const contract = new ethers.Contract(StableLP.address[chainId], StableLP.abi, signer);
        const tx = await contract.connect(signer).redeemMALP(toToken.address, amount);
        await tx.wait();
        setApprovedTo(false);
        hideLoading();
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
      hideLoading();
    }
  };

  const getAQLStable = async (token: any, amount: string) => {
    showLoading();
    try {
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(token, AQLDAI.abi, signer);
      const tx = await contract.connect(signer).mint(account, amount);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
    hideLoading();
  };

  const getAQT = async () => {
    if (!chainId) return;
    showLoading();
    try {
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(AQTTransfer.address[chainId], AQTTransfer.abi, signer);
      const tx = await contract.connect(signer).claimAQT();
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
    hideLoading();
  };

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <Card>
        <div className="space-y-8 bg-gray-main">
          <div className="w-96 p-4 space-y-3 text-lg font-semibold rounded-xl bg-white">
            <span>Deposit Stable Coins</span>
            <div className="rounded-lg border border-gray-main p-2 text-base flex flex-col">
              <span>From</span>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  className={styles.input}
                  value={fromAmount}
                  onChange={(e) => setFromAmount(Math.abs(parseFloat(e.target.value)))}
                />
                <TokenMenu tokens={AqualisTokens} token={fromToken} select={setFromToken} />
              </div>
              <div>
                {fromToken &&
                  userFromBalance &&
                  `Your Balance: ${Intl.NumberFormat().format(userFromBalance)}`}
              </div>
              <div>
                {fromToken &&
                  `Current ${fromToken.symbol} Liquidity: ${Intl.NumberFormat().format(
                    liquidityFromBalance
                  )}`}
              </div>
            </div>
            {!active && <Account />}
            {active && !isApprovedFrom && (
              <PrimaryButton label={'Approve'} onClick={approveFromAmount} />
            )}
            {active && isApprovedFrom && <PrimaryButton label={'Deposit'} onClick={deposit} />}
          </div>
          <div className="w-96 p-4 space-y-3 text-lg font-semibold rounded-xl bg-white">
            <span>Withdraw MALP</span>
            <div className="rounded-lg border border-gray-main p-2 text-base flex flex-col">
              <span>To</span>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  className={styles.input}
                  value={toAmount}
                  onChange={(e) => setToAmount(Math.abs(parseFloat(e.target.value)))}
                />
                <TokenMenu tokens={AqualisTokens} token={toToken} select={setToToken} />
              </div>
              <div>
                {toToken && `Your MALP Balance: ${Intl.NumberFormat().format(userMalpBalance)}`}
              </div>
              <div>{toToken && `Your Balance: ${Intl.NumberFormat().format(userToBalance)}`}</div>
              <div>
                {toToken &&
                  `Current ${toToken.symbol} Liquidity: ${Intl.NumberFormat().format(
                    liquidityToBalance
                  )}`}
              </div>
            </div>
            {!active && <Account />}
            {active && !isApprovedTo && (
              <PrimaryButton label={'Approve'} onClick={approveToAmount} />
            )}
            {active && isApprovedTo && <PrimaryButton label={'Withdraw'} onClick={withdraw} />}
          </div>
        </div>
      </Card>
      <div className="mt-8 space-x-4 flex">
        <button
          className="border border-gray-dark rounded-lg p-2 text-sm"
          onClick={() => getAQLStable(AQLDAI.address[chainId || '5'], '10000000000000000000000')}
        >
          Get AQLDAI
        </button>
        <button
          className="border border-gray-dark rounded-lg p-2 text-sm"
          onClick={() => getAQLStable(AQLUSDC.address[chainId || '5'], '10000000000000000000000')}
        >
          Get AQLUSDC
        </button>
        <button
          className="border border-gray-dark rounded-lg p-2 text-sm"
          onClick={() => getAQLStable(AQLUSDT.address[chainId || '5'], '10000000000000000000000')}
        >
          Get AQLUSDT
        </button>
        <button className="border border-gray-dark rounded-lg p-2 text-sm" onClick={() => getAQT()}>
          Get AQT
        </button>
      </div>
    </div>
  );
};
