'use client'
import { createContext, useEffect, useContext, useState } from "react";
import StakingRewards from "../../artifacts/contracts/StakingRewards.sol/StakingRewards.json";
import STK from "../../artifacts/contracts/MockToken.sol/MockToken.json";
import RTK from "../../artifacts/contracts/MockToken.sol/MockToken.json";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { parseUnits } from "ethers";

const StakingRewardsContext = createContext();
const contractAddress = process.env.NEXT_PUBLIC_STAKING_REWARDS_CONTRACT;

const stkAddress = process.env.NEXT_PUBLIC_STAKING_TOKEN_ADDRESS;
const rtkAddress = process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS;
console.log("contractAddress", contractAddress);

export default function StakingRewardsProvider({ children }) {
    const { provider, account } = useWeb3React();
    const [contract, setContract] = useState(null);
    const [stk, setStk] = useState(null);
    const [rtk, setRtk] = useState(null);

    useEffect(() => {
        if (!provider) return;
        const signer = provider.getSigner();
        const contract = new Contract(contractAddress, StakingRewards.abi, signer);
        const stk = new Contract(stkAddress, STK.abi, signer);
        const rtk = new Contract(rtkAddress, RTK.abi, signer);
        setContract(contract);
        setStk(stk);
        setRtk(rtk);
    }, [provider,account]);
    // const amount = parseUnits('1', 'ether');

    const setRewardsDuration = async (_duration) => {
        console.log('reward duration will last for', _duration, 'seconds.' );
        const duration = parseInt(_duration, 10);
        await contract.setRewardsDuration(duration);
    }

    const notifyRewardAmount = async (_amount) => {
        console.log('rewardToken add ', _amount);
        
        const amount = parseInt(_amount, 10);
        await contract.notifyRewardAmount(amount);
    }

    const mintSTK = async (_amount) => {
        // const amountInt = parseInt(_amount, 10);
        // console.log(_amount);
        const amount = parseUnits('1', 'ether'); 
        console.log('mint STK', account, amount);
        await stk.mint(account, amount);
        // await stk.mint(account, amount);
    }

    const addSTK = async () => {
        if (window.ethereum) {
            window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: stkAddress,
                        symbol: 'STK',
                        decimals: 18,
                        // image: 'https://placekitten.com/200/300',
                    },
                },
            })
        }
    }

    const addRTK = async () => {
        if (window.ethereum) {
            window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rtkAddress,
                        symbol: 'RTK',
                        decimals: 18,
                        // image: 'https://placekitten.com/200/300',
                    },
                },
            })
        }
    }

    const queryBalanceSTK = async () => {
        console.log('query balance', account);
        const stkBalance = await stk.balanceOf(account);
        // const rtkBalance = await rtk.balanceOf(account);
        console.log('STK balance:', stkBalance.toString());
        // console.log('RTK balance:', rtkBalance.toString());
    }

    const queryBalanceRTK = async () => {
        console.log('query balance', account);
        // const stkBalance = await stk.balanceOf(account);
        const rtkBalance = await rtk.balanceOf(account);
        // console.log('STK balance:', stkBalance.toString());
        console.log('RTK balance:', rtkBalance.toString());
    }

    const stakeSTK = async (_amount) => {
        const amount = parseUnits(_amount, 'ether');
        console.log('stake STK', amount);
        const receipt = await stk.approve(contract.address, amount); // 正确的做法是先approve，approve事件会被监听，然后再stake
        await receipt.wait();
        await contract.stake(amount)
    }

    const withdrawRTK = async () => {
        // const amount = parseUnits(_amount, 'ether');
        await contract.withdrawRewards()
        const balance = await contract.userShares[account];
        console.log('withdraw RTK', {balance});
    }

    const withdrawSTK = async (_amount) => {
        const amount = parseUnits(_amount, 'ether');
        console.log('withdraw RTK', amount);
        await contract.withdrawStakingToken(amount)
    }

    const queryEarnedRewards = async () => {
        console.log('earnedAmount', account);
        const earnedAmount = await contract.earned(account);
        console.log('earnedRewards:', earnedAmount.toString());
        return earnedAmount;
    }

    return (
        <StakingRewardsContext.Provider value={{
            contract,
            stk,
            rtk,
            setRewardsDuration,
            notifyRewardAmount,
            mintSTK,
            stakeSTK,
            withdrawRTK,
            addSTK,
            addRTK,
            queryBalanceSTK,
            queryBalanceRTK,
            withdrawSTK,
            queryEarnedRewards

        }}>
            {children}
        </StakingRewardsContext.Provider>
    );
}

export function useStakingRewardsContext() {
    return useContext(StakingRewardsContext);
}