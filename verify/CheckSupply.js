require("dotenv").config();
const { Web3 } = require('web3');
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
const web3 = new Web3( process.env.JSON_RPC_RELAY_URL); // Hedera Testnet RPC URL
const tokenAddress = process.env.DEPLOYED_TOKEN_ADDRESS
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

async function checkSupply() {
  const totalSupply = await myToken.methods.totalSupply().call();
  console.log("Total Supply:", web3.utils.fromWei(totalSupply, "ether"));
}

checkSupply();
