const ganache = require("@dexon-foundation/ganache-cli")
const secret = require('../secret.js')
const mnemonic = secret.mnemonic
const PORT = 8545;
const NETWORK_ID = 5777;
const server = ganache.server({
  network_id: NETWORK_ID,
  hdPath: "m/44'/237'/0'/0/",
  mnemonic,
})

server.listen(8545, function(err, blockchain) {
  console.log(`DEXON-ganacge: Test RPC running on port ${PORT}`);
})