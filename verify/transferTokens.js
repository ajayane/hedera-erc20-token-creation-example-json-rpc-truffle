require("dotenv").config();
const {Web3} = require('web3');
const BigNumber = require("bignumber.js");
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
const web3 = new Web3(process.env.JSON_RPC_RELAY_URL); // Hedera Testnet RPC URL
const tokenAddress = process.env.DEPLOYED_TOKEN_ADDRESS
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

const holderPrivateKey = process.env.ETH_PRIVATE_KEY; // Set this in your .env file
const holderAddress = process.env.CONTRACT_OWNER_ADDRESS // Replace with actual holder address
const recipientAddress = "0x0000000000000000000000000000000000429759"; // Replace with the recipient's address
const transferAmount = web3.utils.toWei("10", "ether"); // Amount to transfer (10 tokens, for example)


async function transferTokens() {
    try {
        // Get the holder's account from the private key
        const account = web3.eth.accounts.privateKeyToAccount(holderPrivateKey);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = holderAddress;

        // Call the transfer function
        const tx = myToken.methods.transfer(recipientAddress, transferAmount);
        const gas = await tx.estimateGas({from: holderAddress});
        const gasPrice = await web3.eth.getGasPrice();
        const gasMultiplier = new BigNumber("2");
        const finalGasPrice = new BigNumber(gasMultiplier) * gasMultiplier
        console.log(gasPrice);
        console.log(finalGasPrice);
        console.log(gas);
        const data = tx.encodeABI();
        const txData = {
            from: holderAddress,
            to: tokenAddress,
            data,
            gas,
            finalGasPrice,
        };

        // Send the transaction
        const receipt = await web3.eth.sendTransaction(txData);
        console.log("Transfer successful. Transaction hash:", receipt.transactionHash);
    } catch (error) {
        console.error("Error transferring tokens:", error);
    }
}

// Execute the transfer
transferTokens().catch((error) => {
    console.error("Error transferring tokens:", error);
});
