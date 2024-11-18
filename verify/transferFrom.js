require("dotenv").config();
const {ContractExecuteTransaction, ContractId, Client, PrivateKey} = require("@hashgraph/sdk")
const {Web3} = require('web3');
const BigNumber = require("bignumber.js");
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
const web3 = new Web3(process.env.JSON_RPC_RELAY_URL); // Hedera Testnet RPC URL
const tokenAddress = "0x5913c2fa8489eeb10a533b98160172e625d7bfe2"//process.env.DEPLOYED_TOKEN_ADDRESS
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

const holderPrivateKey = "0xb17ac3f7c23855ad7cd35827bbb38ce50172ca46bf53ab1568904234953574dc"//process.env.ETH_PRIVATE_KEY; // Set this in your .env file
const holderAddress = "0xf9d4eea760e6bd3f47a8e59c8b2a3edbacf706bd"//process.env.CONTRACT_OWNER_ADDRESS // Replace with actual holder address
const spender = "0x0426fe4685b20d597174e37594348ec6c1a38f3b"; // Replace with the recipient's address
const spenderPrivateKey ="0xb17ac3f7c23855ad7cd35827bbb38ce50172ca46bf53ab1568904234953574dc"// "0xa7b0d036cacf4aca1c1f0f7ebb527a9c8c2abae244f16179c1f053170979c592"; // Replace with the recipient's address
const spenderAccountId = "0.0.3616172"//"0.0.5061447"; // Replace with the recipient's address
const owner = "0x4cf2429328da1381ef5330e6c3ac52754c68a9bc";
const transferAmount = web3.utils.toWei("0.001", "ether"); // Amount to transfer (10 tokens, for example)


async function transferTokens(client) {
    try {
        // Call the transfer function
        const tx = myToken.methods.transferFrom("0x4Cf2429328dA1381Ef5330E6c3aC52754C68A9bc","0x000000000000000000000000000000000041e5f8", transferAmount);
        const data = tx.encodeABI();
        const gas = await tx.estimateGas({from: holderAddress,to:tokenAddress,data:data});
        const gasPrice = await web3.eth.getGasPrice();
        const gasMultiplier = new BigNumber("2");
        const finalGasPrice = new BigNumber(gasPrice) * gasMultiplier
        console.log(gasPrice);
        console.log(finalGasPrice);
        console.log(gas);

        const client = Client.forTestnet()
        client.setOperator(spenderAccountId, PrivateKey.fromStringECDSA(spenderPrivateKey))

        const hTxn = await new ContractExecuteTransaction()
            .setContractId(ContractId.fromString("0.0.5142705"))
            .setFunctionParameters(Buffer.from(data.slice(2), 'hex'))
            .setPayableAmount(0)
            .setGas(Number(gas))
            .freezeWith(client)
            .sign(PrivateKey.fromStringECDSA(spenderPrivateKey))
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

