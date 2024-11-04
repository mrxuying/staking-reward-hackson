'use client'
import { useStakingRewardsContext } from "@/context/contract";
import { Button, Input } from "@mui/material";
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
    queryFinishTime
    
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
              <Button
                className="button"
                variant="contained"
                onClick={addSTK}
              >
                add STK
              </Button>
            </div>
            <div className="mr-4">
              <Button
                className="button"
                variant="contained"
                onClick={addRTK}
              >
                add RTK
              </Button>
            </div>
          </div>
          
          <div className="mr-4">
            <Input placeholder="duration" type="text" onKeyUp={(e) => setDuration(e.target.value)}></Input>
            <Button
              sx={{className:"button"}}
              variant="contained"
              onClick={() =>{setRewardsDuration(duration.toString());}}
            >
              设置奖励持续时间
            </Button>
          </div>
          <div className="mr-4">
            <Input placeholder="rewardAmount" type="text" onKeyUp={(e) => setRewardAmount(e.target.value)}></Input>
            <Button
              sx={{className:"button"}}
              variant="contained"
              onClick={() => {notifyRewardAmount(rewardAmount.toString());}}
            >
              设置奖池金额
            </Button>
          </div>
          <div className="mr-4">
            <Input placeholder="stakeAmount" type="text" onKeyUp={(e) => setStakeAmount(e.target.value)}></Input>
            <Button
              className="button"
              variant="contained"
              onClick={() => {stakeSTK(stakeAmount.toString())}}
            >
              质押 {stakeAmount} 到合约
            </Button>
          </div>
          <div className="mr-4">
            <Button
              className="button"
              variant="contained"
              onClick={() => {withdrawRTK();}}
            >
              取出 RTK 到账号
            </Button>
          </div>
          <div className="mr-4">
            <Input placeholder="stakedAmount" type="text" onKeyUp={(e) => setStakedAmount(e.target.value)}></Input>
            <Button
              className="button"
              variant="contained"
              onClick={ () => {withdrawSTK(stakedAmount.toString());}}
            >
              取出 STK 到账号
            </Button>
          </div>
          
          <div className="mr-4">
            <Button
              className="button"
              variant="contained"
              onClick={ () => {queryEarnedRewards();}}
            >
              查询质押已获取RTK代币奖励
            </Button>
          </div>
          <div className="mr-4">
            <Button
              className="button"
              variant="contained"
              onClick={ () => {queryFinishTime();}}
            >
              查询结束时间
            </Button>
          </div>
        </div>  
      </div>
      <div className="child">  
        <div className="content"> 
          <div className="mr-4">
            <Button
              className="button"
              variant="contained"
              onClick={() => {mintSTK('1000');}}
            >
              领取 STK 到账号
            </Button>
          </div>
          
          <div className="mr-4">
            <Button
              className="button"
              variant="contained"
              onClick={queryBalanceSTK}
            >
              查询STK代币余额
            </Button>
          </div>
          <div className="mr-4">
            <Button
              className="button"
              variant="contained"
              onClick={queryBalanceRTK}
            >
              查询RTK代币余额
            </Button>
          </div>
        </div>  
      </div>
    </div>
  );
}
