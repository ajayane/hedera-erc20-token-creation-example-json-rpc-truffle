const MyToken = artifacts.require("TestERC20Token");
module.exports = async function(deployer) {
  const initialSupply = web3.utils.toWei("100000000000000", "ether"); // Adjust supply as needed
  await deployer.deploy(MyToken, initialSupply);
};