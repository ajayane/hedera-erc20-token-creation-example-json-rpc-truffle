const MyToken = artifacts.require("CopperERC20Token");
const NAME = "CopperERC20Token";
const SYM = "CERC";
module.exports = async function(deployer) {
  const initialSupply = web3.utils.toWei("100000000000000000000000", "ether"); // Adjust supply as needed
  await deployer.deploy(MyToken, NAME,SYM,initialSupply);
};
