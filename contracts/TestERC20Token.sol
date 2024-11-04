// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20Token is ERC20 {
    constructor(uint256 initialSupply) ERC20("TestERC20Token", "TE20T") {
        _mint(msg.sender, initialSupply);
    }
}