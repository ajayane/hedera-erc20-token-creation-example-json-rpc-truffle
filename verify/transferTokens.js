const { Web3 } = require('web3');
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
require("dotenv").config(); // For loading environment variables

// Set up Web3 with Hedera's RPC URL (Testnet in this example)
const web3 = new Web3("https://testnet.hashio.io/api/"); // Hedera Testnet RPC URL

// Define the token's deployed contract address and the holder's details
const tokenAddress = "0x262fa3442381ff599f6cffe08a48886a31e17f8d"; // Replace with your token's contract address
const holderPrivateKey = process.env.ETH_PRIVATE_KEY; // Set this in your .env file
const holderAddress = "0x4cf2429328da1381ef5330e6c3ac52754c68a9bc"; // Replace with actual holder address

// The recipient's address and the amount to transfer
const recipientAddress = "0xRecipientAddress"; // Replace with the recipient's address
const transferAmount = web3.utils.toWei("10", "ether"); // Amount to transfer (10 tokens, for example)

const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

async function transferTokens() {
    try {
        // Get the holder's account from the private key
        const account = web3.eth.accounts.privateKeyToAccount(holderPrivateKey);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = holderAddress;

        // Call the transfer function
        const tx = myToken.methods.transfer(recipientAddress, transferAmount);
        const gas = await tx.estimateGas({ from: holderAddress });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const txData = {
            from: holderAddress,
            to: tokenAddress,
            data,
            gas,
            gasPrice,
        };

        // Send the transaction
        const receipt = await web3.eth.sendTransaction(txData);
        console.log("Transfer successful. Transaction hash:", receipt.transactionHash);
    } catch (error) {
        console.error("Error transferring tokens:", error);
    }
}

// Execute the transfer
transferTokens();
