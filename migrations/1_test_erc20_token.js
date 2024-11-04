const MyToken = artifacts.require("TestERC20Token");
const NAME = "TEST_T2";
const SYM = "TT2";
module.exports = async function(deployer) {
  const initialSupply = web3.utils.toWei("100000000000000", "ether"); // Adjust supply as needed
  await deployer.deploy(MyToken, NAME,SYM,initialSupply);
};
