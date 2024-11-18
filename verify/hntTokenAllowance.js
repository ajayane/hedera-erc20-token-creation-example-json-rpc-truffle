require("dotenv").config();
const {ContractExecuteTransaction, ContractId, Client, PrivateKey, EntityIdHelper} = require("@hashgraph/sdk")
const {Web3} = require('web3');
const BigNumber = require("bignumber.js");
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
const web3 = new Web3(process.env.JSON_RPC_RELAY_URL); // Hedera Testnet RPC URL



const RECEIVER = "0x4Cf2429328dA1381Ef5330E6c3aC52754C68A9bc";
const OPERATOR_ID = "0.0.4318707";
const HOLDER_ADDRESS ='0x000000000000000000000000000000000041e5f3';
const PRIVATE_KEY = "0xf4bb2a22348da0d0363c11bd6e9030d4ab10101098a940bb39716b5191e0782c";
const CONTRACT_ADDRESS ="0x0000000000000000000000000000000000431281"
const CONTRACT_ID ="0.0.4395649"
const transferAmount =  '100000000';

const myToken = new web3.eth.Contract(MyTokenABI, CONTRACT_ADDRESS);

async function transferTokens(client) {
    try {
        // Call the transfer function
        const tx = myToken.methods.approve(RECEIVER, transferAmount);
        const gas = await tx.estimateGas({from: HOLDER_ADDRESS,to:CONTRACT_ADDRESS,data:tx.encodeABI()});
        const gasPrice = await web3.eth.getGasPrice();
        const gasMultiplier = new BigNumber("2");
        const finalGasPrice = new BigNumber(gasPrice) * gasMultiplier
        console.log(gasPrice);
        console.log(finalGasPrice);
        console.log(gas);
        const data = tx.encodeABI();
        console.log("Payload " + data)
        console.log("Signer " + OPERATOR_ID)
        const client = Client.forTestnet()
        client.setOperator(OPERATOR_ID, PrivateKey.fromStringECDSA(PRIVATE_KEY))

        const hTxn = await new ContractExecuteTransaction()
            .setContractId(ContractId.fromString(CONTRACT_ID))
            .setFunctionParameters(Buffer.from(data.slice(2), 'hex'))
            .setPayableAmount(0)
            .setGas(Number(gas))
            .freezeWith(client)
            .sign(PrivateKey.fromStringECDSA(PRIVATE_KEY))
        ;

        const response = await hTxn.execute(client)
        const transactionID = response.transactionId;

        console.log(transactionID.toString())

    } catch (error) {
        console.error("Error transferring tokens:", error);

       throw error;
    }
}

// Execute the transfer
transferTokens().catch((error) => {
    console.error("Error transferring tokens:", error);
});
