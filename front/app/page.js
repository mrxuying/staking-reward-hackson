'use client'
import { useStakingRewardsContext } from "@/context/contract";
import { button, Input } from "@mui/material";
import {useState} from "react";
import "./app.css";

export default function Home() {
  const { 
    setRewardsDuration,
    notifyRewardAmount,
    mintSTK,
    // approveSTK,
    // approveRTK, 
    addSTK, 
    addRTK, 
    stakeSTK, 
    withdrawRTK, 
    withdrawSTK,
    queryBalanceSTK, 
    queryBalanceRTK, 
    queryEarnedRewards,
    queryNowTime
    
  } = useStakingRewardsContext();

  const [duration, setDuration] = useState(1000);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakedAmount, setStakedAmount] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  // const [approveSTKAmount, setApproveSTKAmount] = useState('');
  const [approveRTKAmount, setApproveRTKAmount] = useState('');
  
  return (
    <div className="container">
      <div className="child ">  
        <div className="content">
          <div>
            <div className="mr-4">
              <button onClick={addSTK}>
                add STK
              </button>
            </div>
            <div className="mr-4">
              <button onClick={addRTK}>
                add RTK
              </button>
            </div>
          </div>
          
          <div className="mr-4">
            <input placeholder="duration" type="text" onKeyUp={(e) => setDuration(e.target.value)}/>
            <button onClick={() =>{setRewardsDuration(duration.toString());}}>
              设置奖励持续时间
            </button>
          </div>
          <div className="mr-4">
            <input placeholder="rewardAmount" type="text" onKeyUp={(e) => setRewardAmount(e.target.value)}/>
            <button onClick={() => {notifyRewardAmount(rewardAmount.toString());}}>
              设置奖池金额
            </button>
          </div>
          <div className="mr-4">
            <input placeholder="stakeAmount" type="text" onKeyUp={(e) => setStakeAmount(e.target.value)}/>
            <button onClick={() => {stakeSTK(stakeAmount.toString())}}>
              质押 {stakeAmount} 到合约
            </button>
          </div>
          <div className="mr-4">
            <input placeholder="stakedAmount" type="text" onKeyUp={(e) => setStakedAmount(e.target.value)}/>
            <button onClick={ () => {withdrawSTK(stakedAmount.toString());}}>
              取出 STK 到账号
            </button>
          </div>
          <div className="mr-4">
            <button onClick={() => {withdrawRTK();}}>
              取出 RTK 到账号
            </button>
          </div>
          <div className="mr-4">
            <button onClick={ () => {queryEarnedRewards();}}>
              查询质押已获取RTK代币奖励
            </button>
          </div>
          <div className="mr-4">
            <button onClick={ () => {queryNowTime();}}>
              查询当前时间
            </button>
          </div>
        </div>  
      </div>
      <div className="child">  
        <div className="content"> 
          <div className="mr-4">
            <button onClick={() => {mintSTK('1000');}}>
              领取1000 STK 到账号
            </button>
          </div>
          
          <div className="mr-4">
            <button onClick={queryBalanceSTK}>
              查询STK代币余额
            </button>
          </div>
          <div className="mr-4">
            <button onClick={queryBalanceRTK}>
              查询RTK代币余额
            </button>
          </div>
        </div>  
      </div>
    </div>
  );
}
