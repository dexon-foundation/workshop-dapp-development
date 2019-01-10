# 04 Deploy contract to DEXON Testnet

Inside of `truffle-config.js` we can see:

```js
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
  }
};
```

There's only one network configuration which connects to our local RPC started by `npm run rpc`. If you want to deploy your contract to DEXON Testnet, instead of deploying to `localhost:8545` you may deploy to the following URL:
```js
'http://testnet.dexon.org:8545'
```
This is the RPC server of DEXON Testnet. Now let's add the configuration in `truffle-config.js`

```js

var HDWalletProvider = require("truffle-hdwallet-provider");
const secret = require('../secret')
const mnemonic = secret.mnemonic

module.exports = {
  networks: {
    development: {
        // ...same as before
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
```

Great! Let's move to `package.json`. It's time to add a new command
```js
  "scripts": {
    // previous command....
    "migrate:testnet": "dexon-truffle migrate --network=dexonTestnet --reset"
  },
```

We should specify `--network` as `dexonTestnet` which can be found in `truffle-config.js`.

## Deploy time

Now we are all set! Simply run the command:
```
npm tun migrate:testnet
```

and the contract will be deployed to DEXON Testnet!

## Check Hello.json

Open `./build/contracts/Hello.json` and check the `networks` section. You should be able to see the information of testnet deployment is included now

## Verify in Dapp

- Re-build our webapp again to make sure information of testnet is included: `npm run build:webapp`
- Use any web server to host the files in `./dist` and open it in browser
- In DekuSan wallet you can chosee `DEXON Test Network` now and the dapp should work!
