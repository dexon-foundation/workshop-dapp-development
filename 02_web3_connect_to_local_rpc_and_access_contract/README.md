# 02 Use web3 to connect to local rpc and access contract

If you look into the `dependencies` section of the `package.json` file you will noticed that `web3` is added. From now one, whenever you run `npm install` and `web3` will be installed as one of our dependencies. (you can find it under `node_moudles`)

Now it's time to include `web3` in our dapp entry file: `./app/app.js`
```js
console.log('WELCOME TO DEXON WORKSHOP');

const init = async () => {
  /**
   * Make sure that when you get here, basic UI has already been rendered.
   * Web3 bundle is large so we might want to import it asynchronounsly
   * 
   * Web3 team is working on reducing the bundle size, let's see how it goes
   * https://github.com/ethereum/web3.js/pull/2000 
   */
  const Web3 = await import('web3');
  console.log(Web3); // Check if we successfully imported something
};

init();
```
We are loading `Web3` asynchronously 

After running `npm run build:webapp` and open our dapp in the browser. We should see the `web3` object being printed in the developer console

If you have DekuSan walleted installed, it will inject a global object called `dexon`
In order for your Dapp to access user's account address, you need to:
```
/**
* Request approval to read account address from DekuSan wallet
* You can skip it if you don't need to know user's address
*/
await window.dexon.enable();
```

`dexon` is also a HTTP provider which allows you to communicate with RPC server over HTTP
``` 
const init = async () => {
  const Web3 = await import('web3');
  let httpHandler;
  if (window.dexon) {
    await window.dexon.enable();
    /**
     * 1. DekuSan wallet injects a global variable called 'dexon'
     * 2. 'dexon' is a HTTP provider which allows you to communicate with RPC server over HTTP
     * 3. By passing the provider to web3, we are now able to interact with DEXON
     */
    httpHandler = new Web3.default(window.dexon);
    // httpHandler allows us to interact with the DEXON network
    console.log(httpHandler);
  }
};
```

We just passed in `dexon` provider to web3 and an object is returned (httpHandler).
Let's access some information from the network
```    
// Get the ID of the network which DekuSan wallet is currently connecting to
const networkID = await httpHandler.eth.net.getId();
console.log(networkID); // 5777 for local rpc, 238 for DEXON testnet
```

- Network ID is important becasue that's how dapp knows if the user is using testnet or mainnet
- We also need network id to connect to correct websocket provider. We'll talk about it later. 