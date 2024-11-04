const MyToken = artifacts.require("TestERC20Token");
const NAME = "CopperERC20Token";
const SYM = "CERCT";
module.exports = async function(deployer) {
  const initialSupply = web3.utils.toWei("10000000000000000000000", "ether"); // Adjust supply as needed
  await deployer.deploy(MyToken, NAME,SYM,initialSupply);
};
