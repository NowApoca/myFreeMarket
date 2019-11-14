
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const constants = require("../constants");

async function transfer(fromAddress, toAddress, amount, privKeyHash){
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));;
    const nonce = await web3.eth.getTransactionCount("0xf08af1f662ecc2e795161a85f09fa5067db7d6af")
    const rawTransaction = {
        "from": fromAddress,
        "nonce": '0x' + Number(nonce).toString(16),
        "gasPrice": '0x' + Number(constants.gasPrice * 1e9).toString(16),
        "gasLimit": '0x' + Number(constants.gasLimit).toString(16),
        "to": toAddress,
        "value": '0x' + amount.toString(16),
    };
    const privKey = Buffer.from(privKeyHash, 'hex');
    const tx = new Tx(rawTransaction);
    tx.sign(privKey);
    const serializedTx = tx.serialize();
    const txSent = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    return txSent.transactionHash;
}

async function generateNewAddress(){
    return "NEW ADDRESS"
}

module.exports = {
    transfer,
    generateNewAddress,
}

