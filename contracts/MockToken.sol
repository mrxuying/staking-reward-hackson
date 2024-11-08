// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    // 可以根据需要额外铸造代币
    function mint(address to, uint256 amount) external {
        _mint(to, amount * 1e18);
    }

    function approveTo(address from, uint256 _amount) external returns(bool){
        uint amount = _amount * 1e18;
        _approve(msg.sender, from, amount * 1e18);
        return true;
    }
}
