require("dotenv").config();
const { Web3 } = require('web3');
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
const web3 = new Web3( process.env.JSON_RPC_RELAY_URL); // Hedera Testnet RPC URL
const tokenAddress = process.env.DEPLOYED_TOKEN_ADDRESS
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

const recipientAddress = "0x4Cf2429328dA1381Ef5330E6c3aC52754C68A9bc";

// Initialize the contract instance

async function checkBalance() {
  try {
    // Fetch the recipient's token balance
    const balance = await myToken.methods.balanceOf(recipientAddress).call();
    console.log("Recipient's token balance:", web3.utils.fromWei(balance, "ether"));
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

// Run the function to check the balance
checkBalance();
