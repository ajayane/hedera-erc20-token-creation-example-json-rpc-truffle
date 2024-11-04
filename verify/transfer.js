const { Web3 } = require('web3');
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
require("dotenv").config(); // Load environment variables

// Set up Web3 connection
const web3 = new Web3("https://testnet.hashio.io/api/"); // Hedera Testnet RPC URL

// Your account's private key for signing the transaction
const privateKey = process.env.ETH_PRIVATE_KEY;

// Replace with your deployed contract address and recipient's address
const tokenAddress = "0x262fa3442381ff599f6cffe08a48886a31e17f8d";
const recipientAddress = "0x4cf2429328da1381ef5330e6c3ac52754c68a9bc";

// Initialize the contract
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

async function transferTokens() {
    // Define the amount (e.g., 100 tokens in the smallest unit)
    const amount = web3.utils.toWei("100", "ether"); // Adjust decimals as needed

    // Get the account address from the private key
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    // Create and sign the transaction
    const tx = myToken.methods.transfer(recipientAddress, amount);
    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const txData = {
        from: account.address,
        to: tokenAddress,
        data,
        gas,
        gasPrice,
    };

    const receipt = await web3.eth.sendTransaction(txData);
    console.log("Transfer successful. Transaction hash:", receipt.transactionHash);
}

transferTokens().catch((error) => {
    console.error("Error transferring tokens:", error);
});