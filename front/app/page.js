'use client'
import { useStakingRewardsContext } from "@/context/contract";
import { Button } from "@mui/material";
export default function Home() {
  const { 
    setRewardsDuration,
    notifyRewardAmount,
    mintSTK, 
    addSTK, 
    addRTK, 
    stakeSTK, 
    withdrawRTK, 
    withdrawSTK,
    queryBalanceSTK, 
    queryBalanceRTK, 
    queryEarnedRewards
    
  } = useStakingRewardsContext();
  
  return (
    <div className="flex my-4">
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={() =>{setRewardsDuration('1000');}}
        >
          设置奖励持续时间
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={() => {notifyRewardAmount('2000')}}
        >
          设置奖池金额
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={() => {mintSTK('1000000000000000000')}}
        >
          领取 STK 到账号
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={() => {stakeSTK('5000')}}
        >
          质押 STK 到合约
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={addSTK}
        >
          add STK
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={addRTK}
        >
          add RTK
        </Button>
      </div>

      <div className="mr-4">
        <Button
          variant="contained"
          onClick={queryBalanceSTK}
        >
          查询STK代币余额
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={queryBalanceRTK}
        >
          查询RTK代币余额
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={withdrawRTK}
        >
          取出 RTK 到账号
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={ () => {withdrawSTK('1000')}}
        >
          取出 STK 到账号
        </Button>
      </div>
      
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={queryEarnedRewards}
        >
          查询质押已获取RTK代币奖励
        </Button>
      </div>
    </div>
  );
}
