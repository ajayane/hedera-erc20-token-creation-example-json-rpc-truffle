require("dotenv").config();
const { Web3 } = require('web3');
const MyTokenABI = require("../build/contracts/CopperERC20Token.json").abi;
const web3 = new Web3( process.env.JSON_RPC_RELAY_URL); // Hedera Testnet RPC URL
const tokenAddress = "0x5913c2fa8489eeb10a533b98160172e625d7bfe2"//process.env.DEPLOYED_TOKEN_ADDRESS
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

async function checkBalance() {
  try {
    // Fetch the recipient's token balance
        const allowed = await myToken.methods.allowance("0x4cf2429328da1381ef5330e6c3ac52754c68a9bc","0x79b628d784984a1ba28e2461e66249dad3e7e616").call();
    console.log("Recipient's allowed token balance:", web3.utils.fromWei(allowed, "ether"));
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

// Run the function to check the balance
checkBalance();
