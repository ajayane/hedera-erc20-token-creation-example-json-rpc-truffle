const { Web3 } = require('web3');

const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
const web3 = new Web3("https://testnet.hashio.io/api/"); // Hedera Testnet RPC URL
const tokenAddress = "0x262fa3442381ff599f6cffe08a48886a31e17f8d";
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

async function checkSupply() {
  const totalSupply = await myToken.methods.totalSupply().call();
  console.log("Total Supply:", web3.utils.fromWei(totalSupply, "ether"));
}

checkSupply();
