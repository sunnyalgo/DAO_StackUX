import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Account } from '../base/Account';
import { Card } from '../base/Card';
import { PrimaryButton } from '../base/PrimaryButton';
import AQLDAI from '../lib/AQLDAI.json';
import AqualisTokens from '../lib/AqualisTokens.json';
import { connectors } from '../lib/connectors';
import StableLP from '../lib/StableLP.json';
import { hideLoading, showLoading } from '../lib/uiService';
import { InputAmount } from './InputAmount';
import { TokenSelect } from './TokenSelect';

const ApproveAmount = '9999999999999';
export const Trade: React.FC = () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
  const { active, account, chainId, activate } = useWeb3React();
  const [fromToken, setFromToken] = useState(Object.values(AqualisTokens)[0]);
  const [toToken, setToToken] = useState(Object.values(AqualisTokens)[1]);
  const [fromAmount, setFromAmount] = useState<number>();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [userFromBalance, setUserFromBalance] = useState<number>();
  const [liquidityFromBalance, setLiquidityFromBalance] = useState<number>();
  const [userToBalance, setUserToBalance] = useState<number>();
  const [liquidityToBalance, setLiquidityToBalance] = useState<number>();
  const [allowance, setAllowance] = useState<number>(0);

  useEffect(() => {
    const connect = async () => {
      const connector = window.localStorage.getItem('connector');
      if (connector) {
        await activate(connectors[parseInt(connector) - 1].connector);
      }
    };
    connect();
  }, []);

  useEffect(() => {
    if (fromToken) {
      getAQLFromUserBal();
      getAQLLiquidityFromBal();
      getAQLAllowance();
    }
  }, [fromToken, account]);

  useEffect(() => {
    if (toToken) {
      getAQLLiquidityToBal();
      getAQLToUserBal();
    }
  }, [toToken, account]);

  const getAQLFromUserBal = async () => {
    if (account) {
      const contract = new ethers.Contract(fromToken.address, AQLDAI.abi, provider);
      const res = await contract.balanceOf(account);
      const res1 = res ? parseFloat(ethers.utils.formatEther(res)) : 0;
      setUserFromBalance(res1);
    }
  };
  const getAQLLiquidityFromBal = async () => {
    if (chainId) {
      const contract = new ethers.Contract(fromToken.address, AQLDAI.abi, provider);
      const res = await contract.balanceOf(
        StableLP.address[chainId as unknown as keyof typeof StableLP.address]
      );
      const res1 = res ? parseFloat(ethers.utils.formatEther(res)) : 0;
      setLiquidityFromBalance(res1);
    }
  };
  const getAQLToUserBal = async () => {
    if (account) {
      const contract = new ethers.Contract(toToken.address, AQLDAI.abi, provider);
      const res = await contract.balanceOf(account);
      const res1 = res ? parseFloat(ethers.utils.formatEther(res)) : 0;
      setUserToBalance(res1);
    }
  };
  const getAQLLiquidityToBal = async () => {
    if (chainId) {
      const contract = new ethers.Contract(toToken.address, AQLDAI.abi, provider);
      const res = await contract.balanceOf(
        StableLP.address[chainId as unknown as keyof typeof StableLP.address]
      );
      const res1 = res ? parseFloat(ethers.utils.formatEther(res)) : 0;
      setLiquidityToBalance(res1);
    }
  };
  const getAQLAllowance = async () => {
    if (chainId) {
      const contract = new ethers.Contract(fromToken.address, AQLDAI.abi, provider);
      const res = await contract.allowance(
        account,
        StableLP.address[chainId as unknown as keyof typeof StableLP.address]
      );
      const res1 = res ? parseFloat(ethers.utils.formatEther(res)) : 0;
      setAllowance(res1);
    }
  };

  useEffect(() => {
    if (toToken && fromToken && toToken.key === fromToken.key) {
      const otherKey = toToken.key === 'usdt' ? 'usdc' : 'usdt';
      setToToken(AqualisTokens[otherKey]);
    }
  }, [fromToken, toToken]);

  useEffect(() => {
    const amount = fromAmount || 0;
    if (allowance > amount) setIsApproved(true);
    else setIsApproved(false);
  }, [allowance, fromAmount, fromToken]);

  const toAmount = useMemo(() => {
    if (
      toToken &&
      fromToken &&
      fromAmount &&
      liquidityFromBalance &&
      liquidityToBalance &&
      fromAmount > 0
    ) {
      const totalLiquidityBal =
        (liquidityFromBalance + fromAmount / 2) / (liquidityFromBalance + liquidityToBalance);
      const fee = 0.001 * totalLiquidityBal - 0.0004;
      const amount = fromAmount * (1 - fee);
      return amount;
    } else return 0;
  }, [fromAmount, toToken, fromToken]);

  const handleApprove = useCallback(async () => {
    showLoading();
    try {
      const amount = ethers.utils.parseEther(ApproveAmount);
      const pro = new ethers.providers.Web3Provider(window.ethereum || window.web3.currentProvider);
      const signer = pro.getSigner();
      const contract = new ethers.Contract(fromToken.address, AQLDAI.abi, signer);
      const tx = await contract
        .connect(signer)
        .approve(StableLP.address[chainId as unknown as keyof typeof StableLP.address], amount);
      await tx.wait();
      setIsApproved(true);
    } catch (e) {
      console.log(e);
    }
    hideLoading();
  }, [fromToken, fromAmount]);

  const submit = useCallback(async () => {
    if (fromAmount && userFromBalance && liquidityToBalance) {
      try {
        if (fromAmount > userFromBalance || toAmount > liquidityToBalance) {
          alert('Not enough balance!');
        } else {
          showLoading();
          const amount = ethers.utils.parseEther(fromAmount.toString());
          const pro = new ethers.providers.Web3Provider(
            window.ethereum || window.web3.currentProvider
          );
          const signer = pro.getSigner();
          const contract = new ethers.Contract(
            StableLP.address[chainId as unknown as keyof typeof StableLP.address],
            StableLP.abi,
            signer
          );
          const tx = await contract
            .connect(signer)
            .swap(amount, fromToken.address, toToken.address);
          await tx.wait();
          setIsApproved(false);
          hideLoading();
          window.location.reload();
        }
      } catch (e) {
        console.log(e);
        hideLoading();
      }
    }
  }, [fromToken, fromAmount]);

  const changeToken = () => {
    const _toToken = toToken;
    setToToken(fromToken);
    setFromToken(_toToken);
  };

  return (
    <div className="flex items-center justify-center my-8">
      <Card>
        <div className="flex flex-col w-96 p-4 text-lg font-semibold rounded-xl bg-white">
          <span className="font-bold mb-6">Trade</span>
          <TokenSelect
            title="From"
            token={fromToken}
            tokens={AqualisTokens}
            select={setFromToken}
          />
          {fromToken && (
            <div className="flex flex-col text-sm">
              <span>Your Balance: {Intl.NumberFormat().format(userFromBalance || 0)}</span>
              <span>
                Current {fromToken.symbol} Liquidity:{' '}
                {Intl.NumberFormat().format(liquidityFromBalance || 0)}
              </span>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <FontAwesomeIcon
              icon={faArrowsRotate}
              className="w-5 h-5 cursor-pointer"
              onClick={changeToken}
            />
          </div>
          <TokenSelect title="To" token={toToken} tokens={AqualisTokens} select={setToToken} />
          {toToken && (
            <div className="flex flex-col text-sm">
              <span>Your Balance: {Intl.NumberFormat().format(userToBalance || 0)}</span>
              <span>
                Current {toToken.symbol} Liquidity:{' '}
                {Intl.NumberFormat().format(liquidityToBalance || 0)}
              </span>
            </div>
          )}
          <InputAmount
            className="my-4"
            onChange={setFromAmount}
            value={fromAmount}
            max={userFromBalance || 0}
          />
          <div className="box-shadow py-2 px-4 bg-gray-light rounded-lg mb-14">
            <span>
              {liquidityToBalance && toAmount && toAmount > liquidityToBalance
                ? 'Insufficient liquidity'
                : `You will receive: $${Intl.NumberFormat().format(toAmount)}`}
            </span>
          </div>
          {!active && <Account />}
          {active && !isApproved && <PrimaryButton label={'Approve'} onClick={handleApprove} />}
          {active && isApproved && <PrimaryButton label={'Swap'} onClick={submit} />}
        </div>
      </Card>
    </div>
  );
};
