require("dotenv").config();
const {ContractExecuteTransaction, ContractId, Client, PrivateKey} = require("@hashgraph/sdk")
const {Web3} = require('web3');
const BigNumber = require("bignumber.js");
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
const web3 = new Web3(process.env.JSON_RPC_RELAY_URL); // Hedera Testnet RPC URL
const tokenAddress = "0x5913C2FA8489EeB10a533B98160172e625D7BfE2"//process.env.DEPLOYED_TOKEN_ADDRESS
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

const holderPrivateKey = process.env.ETH_PRIVATE_KEY; // Set this in your .env file
const holderAddress = process.env.CONTRACT_OWNER_ADDRESS // Replace with actual holder address
const recipientAddress = "0x000000000000000000000000000000000041e5f3"; // Replace with the recipient's address
const transferAmount = web3.utils.toWei("100", "ether"); // Amount to transfer (10 tokens, for example)


async function transferTokens(client) {
    try {


        // Get the holder's account from the private key
        const account = web3.eth.accounts.privateKeyToAccount(holderPrivateKey);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = holderAddress;

        // Call the transfer function
        const tx = myToken.methods.transfer(recipientAddress, transferAmount);
        console.log(tx.toString('hex'))
        const gas = await tx.estimateGas({from: holderAddress});
        const gasPrice = await web3.eth.getGasPrice();
        const gasMultiplier = new BigNumber("2");
        const finalGasPrice = new BigNumber(gasPrice) * gasMultiplier
        console.log(gasPrice);
        console.log(finalGasPrice);
        console.log(gas);
        const data = tx.encodeABI();
        console.log("Payload " + data)
        console.log("Signer " + process.env.OPERATOR_ID)
        const txData = {
            from: holderAddress,
            to: tokenAddress,
            data,
            gas,
            gasPrice: finalGasPrice
        };

        const client = Client.forTestnet()
        client.setOperator(process.env.OPERATOR_ID, PrivateKey.fromStringECDSA(process.env.ETH_PRIVATE_KEY))

        const hTxn = await new ContractExecuteTransaction()
            .setContractId(ContractId.fromString("0.0.5142705"))
            .setFunctionParameters(Buffer.from(data.slice(2), 'hex'))
            .setPayableAmount(0)
            .setGas(Number(gas))
            .freezeWith(client)
            .sign(PrivateKey.fromStringECDSA(process.env.ETH_PRIVATE_KEY))
        ;

        // console.log(txData)
        // console.log(hTxn);

        const response = await hTxn.execute(client)
        const transactionID = response.transactionId;

        console.log(transactionID.toString())
        // const receiptH = await response.getReceipt(client);
        // const status = await receiptH.status.toString();
        //
        //
        //
        //
        // const record = await transactionID.getRecord(client);
        // const transactionHash = record.transactionHash.toString("hex");
        //
        // console.log("Transaction hash" + transactionHash)
        // console.log("Transaction status" + status)
        // Send the transaction
        // const receipt = await web3.eth.sendTransaction(txData);
        // console.log("Transfer successful. Transaction hash:", receipt.transactionHash);
    } catch (error) {
        console.error("Error transferring tokens:", error);
    }
}

// Execute the transfer
transferTokens().catch((error) => {
    console.error("Error transferring tokens:", error);
});


// {
//   "from": "0x4cf2429328da1381ef5330e6c3ac52754c68a9bc",
//   "to": "00000000000000000000000000000000004d69ff",
//   "value": "10000000000000000",
//   "data": "0xa9059cbb0000000000000000000000000000000000000000000000000000000000429759000000000000000000000000000000000000000000000000002386f26fc10000"
// }

// {
//   "from": "0x4cf2429328da1381ef5330e6c3ac52754c68a9bc",
//   "to": "0xf04e2f1d55c8316d83feaa37900c9928f66dd229",
//   "value": "10000000000000000",
//   "data": "0xa9059cbb0000000000000000000000000000000000000000000000000000000000429759000000000000000000000000000000000000000000000000002386f26fc10000"
// }
//
// {
//   "from": "0x4cf2429328da1381ef5330e6c3ac52754c68a9bc",
//   "to": "0xf04e2f1d55c8316d83feaa37900c9928f66dd229",
//   "value": "0",
//   "data": "0xa9059cbb0000000000000000000000000000000000000000000000000000000000429759000000000000000000000000000000000000000000000000002386f26fc10000"
// }
