

var ganache = require('ganache-cli');
async function runBlockChain() {
    try {
        var server = ganache.server({
            accounts: [
                {
                    balance: '0x056bc75e2d63100000',
                    secretKey: '0xc960c3508c4a73e189b9ec0599f6382f18aacbcd9274bf181702f1a7c4f30e24'
                }
            ]
        });
        server.listen(8545, function(err, blockchain) {
            console.error('ERR ', err);
            console.error('BLOCKCHAIN ', blockchain);
        });
    } catch (err) {
        console.error(err);
    }
}
runBlockChain();

// 0x3bc2798FcAF5D24aa234d58cB436Adf7cA4152e2
// 0x3bc2798FcAF5D24aa234d58cB436A

// 0x56bc737fa7ffb6000
// 0x56bc75e2d63100000
// 100 000 000 000 000 000 000
//  99 999 958 000 000 000 000
