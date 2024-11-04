// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20Token is ERC20 {
    address public owner;

     constructor(string memory _name, string memory _sym, uint256 initialSupply) ERC20(_name, _sym) {
        owner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can access");
        _;
    }

    function mint(address to, uint256 value) public onlyOwner {
        uint toMint = value * 10**uint(decimals());
        _mint(to, toMint);
    }

    function burn(uint256 value) public {
        uint toBurn = value * 10**uint(decimals());
        _burn(msg.sender, toBurn);
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        _transfer(from, to, amount);

        uint256 currentAllowance = allowance(from, msg.sender);
        require(currentAllowance >= amount, string(abi.encodePacked(name(), ": transfer amount exceeds allowance")));
        
        _approve(from, msg.sender, currentAllowance - amount);

        return true;
    }
}