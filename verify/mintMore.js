require("dotenv").config();
const { Web3 } = require('web3');
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
const web3 = new Web3( process.env.JSON_RPC_RELAY_URL); // Hedera Testnet RPC URL
const tokenAddress = process.env.DEPLOYED_TOKEN_ADDRESS
const recipientAddress = process.env.CONTRACT_OWNER_ADDRESS
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

async function mintMore() {
  const response = await myToken.methods.mint(recipientAddress,1000000).call();
  console.log("Mint More:");
  console.log(response);

}

mintMore();
