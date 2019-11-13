

var Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
console.log(Tx)
// Show Web3 where it needs to look for a connection to Ethereum.
//web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// var gasPrice = 2;//or get with web3.eth.gasPrice
// var gasLimit = 3000000;

// var rawTransaction = {
//   "from": "0xf08af1f662ecc2e795161a85f09fa5067db7d6af",
//   "nonce": '0x' + Number(3).toString(16),
//   "gasPrice": '0x' + Number(gasPrice * 1e9).toString(16),
//   "gasLimit": '0x' + Number(gasLimit).toString(16),
//   "to": "0x3bc2798FcAF5D24aa234d58cB436Adf7cA4152e2",
//   "value": '0x100',
//   "chainId": 4 //remember to change this
// };
//     var privKey = Buffer.from("c960c3508c4a73e189b9ec0599f6382f18aacbcd9274bf181702f1a7c4f30e24", 'hex');
//     var tx = new Tx(rawTransaction);

//     tx.sign(privKey);
//     var serializedTx = tx.serialize();

//     web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
//       if (!err)
//           {
//             console.log('Txn Sent and hash is '+hash);
//           }
//       else
//           {
//             console.error(err);
//           }
//     });


async function a(){
    const block = await web3.eth.getBlock(1);
    console.log(block)
}
a()








