var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');
const bigi = require('bigi');


function getAddress(keyPair,coin){
  var pvtKey = bigi.fromDERInteger(keyPair.privateKey)
  switch(coin){
    case "ETH":
      return "0x" + wallet.getAddress().toString('hex')
    break;
  }
}

function coinType(coin){
    switch(coin){
      case 'BTC':
        return "0"
      break;
      case 'TEST':
        return "1"
      break;
      case 'LTC':
        return "2"
      break;
      case 'DASHTEST':
        return "1"
      break;
      case "BTG":
        return "57"
      break;
      case "DASH":
        return "156"
      break;
      case "ETH":
        return "60"
      break;
      case "XRP":
        return "144"
      break;
    }
  }
async function bip44 (coin,num,index,mnemonic){
  let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(mnemonic));
  let wallet_hdpath = 'm/44"/' + coinType("ETH") +'/100"/100';
  let wallets = {};
  let addresses = [];
  var wallet = hdwallet.derivePath(wallet_hdpath).getWallet();
  var addr = "0x"+wallet.getAddress().toString("hex");
  addresses.push({address: addr, PrivateKey: wallet._privKey.toString('hex'), PublicKey: hdwallet.derivePath(wallet_hdpath)._hdkey.publicKey.toString('hex')});
  wallets[addr] = wallet;
  console.log(addresses, wallet_hdpath)
  return {addresses:addresses,hdpath: wallet_hdpath}
}

bip44("ETH",1,0,"dad minute exhibit slot ball vault fever busy awkward cook gloom already")

module.exports = {
  bip44: bip44,
}