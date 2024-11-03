// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./MockToken.sol";
import "hardhat/console.sol";

// 算法
contract StakingRewards {
    // 给代币增加immutable属性，使其不可修改@xucz
    MockToken public immutable stakingToken;
    MockToken public immutable rewardToken;

    uint256 public totalShares; // 系统的总份额
    uint256 public totalStaked; // 系统的总质押金额

    //增加合约拥有者，管理员, 奖励持续时间，开始结束时间
    address public owner;
    uint public duration;
    uint public finishAt;
    uint public updatedAt;
    uint public rewardRate;
    uint public rewardPerTokenStored;   //当前每s单位质押token可获得的奖励金额
    uint private constant MULTIPLIER = 1e18;

    mapping(address => uint256) public userShares; // 每个用户已提取的份额
    mapping(address => uint256) public userStaked; // 每个用户的质押金额
    mapping(address => uint) public userRewardPerTokenPaid; // 每个用户每秒单位质押奖励金额

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, MockToken indexed token, uint256 amount);
    error NoRewardsError(address account, string text);

    constructor(
        MockToken _stakingToken,
        MockToken _rewardToken,
        uint256 _amount
    ) {
        owner = msg.sender;
        uint amount = _amount * MULTIPLIER;
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
        rewardToken.mint(address(this), amount);
        rewardToken.approve(address(this), amount);
    }

    modifier onlyOwner() {
        require(msg.sender==owner, "not owner");
        _;
    }

    //计算更新提取质押token或奖励token后的用户份额
    modifier calculateReward(address _account){
        rewardPerTokenStored = rewardsPerStakingToken();
        updatedAt = lastTimeRewardApplicable();
        
        if(_account != address(0)){
            //更新用户奖励份额
            userShares[_account] = earned(_account);
            //更新用户单位质押token奖励金额
            userRewardPerTokenPaid[_account] = rewardPerTokenStored;
        }
        _;
    }

    function rewardsPerStakingToken() public view returns(uint){
        //截止目前单位token奖励金额
        if(totalStaked == 0){
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + (rewardRate * (lastTimeRewardApplicable() - updatedAt)) * MULTIPLIER / totalStaked;
    }

    function lastTimeRewardApplicable() public view returns(uint){
        return block.timestamp < finishAt ? block.timestamp : finishAt;
    }

    function earned(address _account) public returns(uint){
        //截止目前存量获得奖励数量
        userShares[_account] += ((userStaked[_account] * (rewardsPerStakingToken() - userRewardPerTokenPaid[_account])) / MULTIPLIER);
        return userShares[_account];
    }

    function setRewardsDuration(uint _duration) external onlyOwner {
        //修改活动区间时，活动必须是未开始或者已结束状态
        require(finishAt < block.timestamp, "reward duration not finished");
        require(_duration > 0, "duration should be greater than zero");
        duration = _duration;
    }

    //设置奖金比例
    function notifyRewardAmount(uint _amount) external onlyOwner calculateReward(address(0)) {
        require(duration > 0 ,"duration should be greater than zero");
        require(_amount > 0 ,"rewardAmount should be greater than zero");
        uint amount = _amount * MULTIPLIER;
        if(block.timestamp > finishAt){
            //如果没有开始或者活动结束：奖金增长速率为 amount / duration(s)    
            rewardRate = amount / duration;
        } else {
            //否则使用原本剩余奖池数量 + 新加入的奖金数量 / duration
            uint remainingRewards = rewardRate * (finishAt - block.timestamp);
            rewardRate = (remainingRewards + amount) / duration;
        }

        require(rewardRate > 0, "rewardRate can not be 0");
        require(duration * rewardRate <= rewardToken.balanceOf(address(this)), "rewards amount > balance");
        //开始和结束时间
        totalShares += amount;
        finishAt = block.timestamp + duration;
        updatedAt = block.timestamp;
    }

    // 用户质押函数
    function stake(uint256 _amount) external calculateReward(msg.sender) {
        console.log("amount", _amount);
        require(_amount > 0, "Amount must be greater than zero");
        uint amount = _amount * MULTIPLIER;
        stakingToken.approve(address(this), amount);
        (bool success) = stakingToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");
        emit Staked(msg.sender, amount);

        userStaked[msg.sender] += amount;
        totalStaked += amount;
    }

    // 计算用户的可领取奖励
    // function calculateReward(address user) public view returns (uint256) {
    //     if (totalShares == 0) {
    //         return 0;
    //     }
    //     // 根据用户的份额占比，计算其可领取的奖励
    //     uint256 userSharePercentage = (userShares[user] * 1e18) / totalShares;
    //     uint256 rewardAmount = (rewardToken.balanceOf(address(this)) *
    //         userSharePercentage) / 1e18;
    //     return rewardAmount;
    // }

    function withdrawRewards() external calculateReward(msg.sender) {
        uint reward = userShares[msg.sender];
        //取出奖励token
        if(reward == 0){
            revert NoRewardsError(msg.sender, "no reward to withdraw");
        }
        userShares[msg.sender] = 0;
        totalShares -= reward;
        (bool success) = rewardToken.transfer(msg.sender, reward);
        require(success, "transfer failed");
        emit Withdrawn(msg.sender, rewardToken, reward);

    }

    function withdrawStakingToken(uint _amount) external calculateReward(msg.sender) {
        uint amount = _amount * MULTIPLIER;
        require(amount > 0, "amount can not be 0");
        require(amount <= stakingToken.balanceOf(msg.sender));
        //取出质押金额
        userStaked[msg.sender] -= amount;
        totalStaked -= amount;
        (bool success) = stakingToken.transfer(msg.sender, amount);
        require(success, "transfer failed");
        emit Withdrawn(msg.sender, stakingToken, amount);
    }

    // 用户提取质押和奖励
    // function withdraw(uint256 amount) external {
    //     require(amount > 0, "Amount must be greater than zero");
    //     require(userStaked[msg.sender] >= amount, "Insufficient staked amount");

    //     uint256 share = (amount * totalShares) / totalStaked;
    //     totalShares -= share;
    //     userShares[msg.sender] -= share;

    //     userStaked[msg.sender] -= amount;
    //     totalStaked -= amount;

    //     // 发放奖励
    //     uint256 reward = calculateReward(msg.sender);
    //     rewardToken.transfer(msg.sender, reward);

    //     // 归还质押
    //     stakingToken.transfer(msg.sender, amount);
    //     emit Withdrawn(msg.sender, amount);
    // }
}