# 黑客松质押收益项目案例

## StakingRewards项目
#### 合约地址（demo只支持了ethereum sepolia）
ethereum sepolia链合约地址
Staking Token: 0x1b7a4682ab1dAdaC75775a936E12460920C708CD
Reward Token 0x4aaaE6ee7e39DFfE02f6051209A3b5e05a015595
StakingRewards: 0x33b13552d8a0AFcF9D9fa42022CBB7Babc24a0FB

## 增加了时间维度的收益计算


## 合约结构
```
├── contracts
│   ├── StakingRewards.sol
│   ├── StakingToken.sol
│   └── Token.sol
├── scripts
│   ├── deploy.js
│   └── test.js
├── test
│   └── test.js
└── truffle-config.js
```

## 前端代码front结构
```
├── front
│   ├── contracts
│   │   ├── StakingRewards.json
│   │   ├── StakingToken.json
│   │   └── Token.json
│   ├── index.html
│   ├── index.js
│   ├── index.scss
│   ├── lib
│   │   ├── abi.js
│   │   ├── contract.js
│   │   ├── index.js
│   │   ├── web3.js
│   │   └── web3modal.js
│   ├── package-lock.json
│   └── package.json
```

## 功能
1、设置质押收益开始和结束时间
2、设置奖励收益速率
3、质押
4、提取收益
5、提取质押的代币
6、查看收益
7、查看质押代币数量
8、查看奖励代币余额

