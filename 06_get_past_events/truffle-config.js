
var HDWalletProvider = require("truffle-hdwallet-provider");
const secret = require('../secret')
const mnemonic = secret.mnemonic

module.exports = {
  networks: {
    development: {
      provider: new HDWalletProvider(
        mnemonic,
        "http://127.0.0.1:8545",
        0,
        1,
        true,
        "m/44'/237'/0'/0/",
      ),
      network_id: "*",
      host: "localhost",
      port: 8545,
    },
    /**
      DEXON Testnet
    */
    dexonTestnet: {
      provider: () => (
        new HDWalletProvider(
          mnemonic,
          'http://testnet.dexon.org:8545',
          0,
          1,
          true,
          "m/44'/237'/0'/0/"
        )
      ),
      network_id: "*",
    },
  }
};