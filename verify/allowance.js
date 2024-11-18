require("dotenv").config();
const {ContractExecuteTransaction, ContractId, Client, PrivateKey} = require("@hashgraph/sdk")
const {Web3} = require('web3');
const BigNumber = require("bignumber.js");
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
const web3 = new Web3(process.env.JSON_RPC_RELAY_URL); // Hedera Testnet RPC URL
const tokenAddress = process.env.DEPLOYED_TOKEN_ADDRESS
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

const holderPrivateKey = process.env.ETH_PRIVATE_KEY; // Set this in your .env file
const holderAddress = process.env.CONTRACT_OWNER_ADDRESS // Replace with actual holder address
const spender = "0x0426fe4685b20d597174e37594348ec6c1a38f3b"; // Replace with the recipient's address
const owner = "0x4cf2429328da1381ef5330e6c3ac52754c68a9bc";
const transferAmount = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")


async function transferTokens(client) {
    try {

        // Call the transfer function
        const tx = myToken.methods.approve(spender, transferAmount);
        const data = tx.encodeABI();
        const gas = await tx.estimateGas({from: holderAddress,to:tokenAddress,data:data});
        const gasPrice = await web3.eth.getGasPrice();
        const gasMultiplier = new BigNumber("2");
        const finalGasPrice = new BigNumber(gasPrice) * gasMultiplier
        console.log(gasPrice);
        console.log(finalGasPrice);
        console.log(gas);

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
            .setContractId(ContractId.fromString("0.0.5073407"))
            .setFunctionParameters(Buffer.from(data.slice(2), 'hex'))
            .setPayableAmount(0)
            .setGas(Number(gas))
            .freezeWith(client)
            .sign(PrivateKey.fromStringECDSA(process.env.ETH_PRIVATE_KEY))
        ;

        const response = await hTxn.execute(client)
        const transactionID = response.transactionId;

        console.log(transactionID.toString())

    } catch (error) {
        console.error("Error transferring tokens:", error);
    }
}

// Execute the transfer
transferTokens().catch((error) => {
    console.error("Error transferring tokens:", error);
});

