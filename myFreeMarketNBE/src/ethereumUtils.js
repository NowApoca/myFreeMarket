const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const constants = require("../constants");
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');

const mnemonic = "dad minute exhibit slot ball vault fever busy awkward cook gloom already"

async function transfer(fromAddress, toAddress, amount, account){
    const nonce = await web3.eth.getTransactionCount("0xf08af1f662ecc2e795161a85f09fa5067db7d6af")
    const rawTransaction = {
        "from": fromAddress,
        "nonce": '0x' + Number(nonce).toString(16),
        "gasPrice": '0x' + Number(constants.gasPrice * 1e9).toString(16),
        "gasLimit": '0x' + Number(constants.gasLimit).toString(16),
        "to": toAddress,
        "value": '0x' + amount.toString(16),
    };
    console.log(fromAddress, account)
    const privKeyHash = await getPrivateKey(account.id, account.addressIndex)
    const privKey = Buffer.from(privKeyHash, 'hex');
    const tx = new Tx(rawTransaction);
    tx.sign(privKey);
    const serializedTx = tx.serialize();
    const txSent = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    return txSent.transactionHash;
}

async function generateNewAddress ( accountId, addressIndex){
    let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(mnemonic));
    let wallet_hdpath = 'm/44"/60/'+accountId+'"/' + addressIndex;
    var wallet = hdwallet.derivePath(wallet_hdpath).getWallet();
    return "0x"+wallet.getAddress().toString("hex");
}

async function getPrivateKey( accountId, addressIndex){
    let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(mnemonic));
    let wallet_hdpath = 'm/44"/60/'+accountId+'"/' + addressIndex;
    var wallet = hdwallet.derivePath(wallet_hdpath).getWallet();
    return wallet._privKey.toString('hex');
    // publicKey: hdwallet.derivePath(wallet_hdpath + i)._hdkey.publicKey.toString('hex')
}

async function isValidEthAddress(address){
    return web3.utils.isAddress(address);
}

module.exports = {
    transfer,
    generateNewAddress,
    getPrivateKey,
    isValidEthAddress,
}

