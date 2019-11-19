var Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;

async function sendTx(from, to , priv){
// Show Web3 where it needs to look for a connection to Ethereum.
//web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var gasPrice = 2;//or get with web3.eth.gasPrice
var gasLimit = 3000000;
    const nonce = await web3.eth.getTransactionCount(from)
var rawTransaction = {
    "nonce": '0x' + Number(nonce).toString(16),
    "gasPrice": '0x' + Number(gasPrice * 1e9).toString(16),
    "gasLimit": '0x' + Number(gasLimit).toString(16),
    "to": to,
    "value": '0xDE0B6B3A7640000',
    "chainId": 4 //remember to change this
    };
    var privKey = Buffer.from(priv, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    let hash;
    try{
        hash= await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    }catch(e){
        console.log(e)
        console.log(from, to, '0xDE0B6B3A7640000',)
        throw new Error()
    }
    return hash.transactionHash;
}

// sendTx("0x095960fa4006c155a7e6997c56e45a574b10a93c", "0xf08af1f662ecc2e795161a85f09fa5067db7d6af", "716c0b546d6caa7aa2f4c51f117eaad06b1053668dd254a22a74da7589082c09")
// c960c3508c4a73e189b9ec0599f6382f18aacbcd9274bf181702f1a7c4f30e24 0xf08af1f662ecc2e795161a85f09fa5067db7d6af
// 716c0b546d6caa7aa2f4c51f117eaad06b1053668dd254a22a74da7589082c09 0x095960fa4006c155a7e6997c56e45a574b10a93c
module.exports = {
  sendTx: sendTx,
}




