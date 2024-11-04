// Import Web3 library and the ABI of the token contract
const { Web3 } = require('web3');
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;

// Set up Web3 with Hedera's RPC URL (Testnet in this example)
const web3 = new Web3("https://testnet.hashio.io/api/"); // Hedera Testnet RPC URL

// Define your token's deployed contract address and the recipient's address
const tokenAddress = "0x262fa3442381ff599f6cffe08a48886a31e17f8d";
const recipientAddress = "0x4cf2429328da1381ef5330e6c3ac52754c68a9bc";

// Initialize the contract instance
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

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
