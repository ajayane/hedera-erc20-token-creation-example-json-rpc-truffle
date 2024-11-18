require("dotenv").config();
const { Web3 } = require('web3');
const {Transaction, ContractExecuteTransaction, Hbar} = require("@hashgraph/sdk");
const MyTokenABI = require("../build/contracts/TestERC20Token.json").abi;
const web3 = new Web3( process.env.JSON_RPC_RELAY_URL); // Hedera Testnet RPC URL
const tokenAddress = process.env.DEPLOYED_TOKEN_ADDRESS
const myToken = new web3.eth.Contract(MyTokenABI, tokenAddress);

const recipientAddress = "0x4cf2429328da1381ef5330e6c3ac52754c68a9bc";

const raw  ='0a89022a86020a9a010a170a0808efd7d7b906100012090800100018bcdedc011800120608001000180318b1cb89032202087832157465737420657263323020746f6b656e206d656d6f3a570a090800100018ffd3b5021093d80218002244a9059cbb0000000000000000000000000000000000000000000000000000000000429759000000000000000000000000000000000000000000000000002386f26fc1000012670a650a2102aa3c04518854213e201d129abbde4f2496b1c733c9bf53e16e654e42479020523240b65e55f90cfc3146f2c73b119514fe48fd492353021ea6405efbd59eb8375d320668bdcb7c891e4947c03acc0b94a0289144e669a134e7a1fbe24ad9d84e97a6'

var x = {
  "from": "0x4cf2429328da1381ef5330e6c3ac52754c68a9bc",
  "to": "0xf04e2f1d55c8316d83feaa37900c9928f66dd229",
  "value": "0",
  "data":
      "0x23b872dd0000000000000000000000004cf2429328da1381ef5330e6c3ac52754c68a9bc000000000000000000000000f04e2f1d55c8316d83feaa37900c9928f66dd22900000000000000000000000000000000000000000000000000038d7ea4c68000"
      "0x23b872dd0000000000000000000000004cf2429328da1381ef5330e6c3ac52754c68a9bc000000000000000000000000000000000000000000000000000000000041e5f800000000000000000000000000000000000000000000000000038d7ea4c68000"
}
async function decodeTransaction() {

    const amount = Hbar.fromTinybars(6471096)
    amount.toBigNumber()
    const txn = ContractExecuteTransaction.fromBytes(Buffer.from(raw, 'hex'))
    console.log(txn.from);
    console.log(txn.getSignatures());
    console.log(txn._functionParameters.toString('hex'));

    console.log(txn);
}
decodeTransaction();
