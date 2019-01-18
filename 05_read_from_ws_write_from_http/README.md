# Read from Websocket provider and Write via Http provider

`dexon` object injected by DekuSan wallet is a Http provider. Starts from `web3 1.0` Http provider no longer supports event subscribing. If we want to subscribe to contract event we need to initiate a websocket handler.

## Why do we need another handler?

- Web3 can only receive returned value from `pure` and `view` functions in the smart contract
  - We use `call()` to access those functions: `contractHandler.methods.someMethod.call()`
  - When we use `send()` to call a function, new transaction will be initiated and we won't be receiving the returned value. Emitting a new event which containes the returned value is one way to get those value.
- Your Dapp becomes more interactive
  - For dapps like games and chat, it will be easy to receive results from other user's transaction
- Even if DekuSan wallet is not installed or available, we can still read contract status

## Endpoints for DEXON Websocket provider

First of all, we need an websocket endpoint to connect to. For DEXON Testnet we can connect to:
```
ws://testnet.dexon.org:8546
```

If you're serving the dapp over `https`, you will need to connect to:
```
wss://ws-proxy.dexon.org
```

For `local rpc` started by `npm run rpc`:
```
ws://localhost:8545
```

## Initate wsHandler via web3

Before initiating a new websocket handler, we need to check on two things:
- Is DekuSan wallet available? If so, which network is it connecting to?
- Is the dapp being served via `http` or `https`

Now let us re-write our dapp based on both `http` and `websocket`:

1. if `window.dexon` exist, we init `httpHandler` can get `netId` immediately
```js
const Web3 = await import('web3');

let httpHandler;
let wsHandler;
let netId;

if (window.dexon) {
  await window.dexon.enable();
  httpHandler = new Web3.default(window.dexon);
  netId = await httpHandler.eth.net.getId();
}
```

2. `wsHandler` should be initiated with or withour `window.dexon`, but we need to know the correct endpoint to connect to. Let's write a function which help us to get the correct ws endpoint.
```js

if (window.dexon) {
  // ...
}

const getWebsocketEndpoint = () => {
  const DEXON_WS_ENDPOINT = (location.protocol === 'https:')
    ? 'wss://ws-proxy.dexon.org'
    : 'ws://testnet.dexon.org:8546';

  switch(netId) {
    case 5777: // If DekuSan is using local rpc
      return 'ws://localhost:8545';
    // If DekuSan is connect to testnet or not availble
    case 238:
    default:
      return DEXON_WS_ENDPOINT;
  }
}
const ws_endpoint = getWebsocketEndpoint();
console.log(`Websocket endpoint: ${ws_endpoint}`);
```

and we can init the `wsHandler` based on the `ws_endpoint`

```js
wsHandler = new Web3.default(ws_endpoint);
```

Load contract `ABI` and `address`
```js
const contractInfo = (await import('../build/contracts/Hello.json')).default;
const { abi, networks } = contractInfo;
// If there's no netId, we use 238 as default network
const address = networks[netId || 238].address;
```

`wsHandler` should be used to create `contractReader` and use `httpHandler` to create `contractWriter`
```js
let contractReader;
let contractWriter;

// contractReader is created from wsHandler
contractReader = new wsHandler.eth.Contract(abi, address);

// contractWriter is created from httpHandler
if (httpHandler) {
  contractWriter = new httpHandler.eth.Contract(abi, address);
}
```

1. Find the DOM element to display `value`
2. Read `value` from the contract and update it to the DOM
```js
// DOM Element to display "value" in contract
const valueDisplayElement = document.getElementById('value');
// Get current value and display it
const val = await contractReader.methods.value().call();
valueDisplayElement.textContent = val;
```


If we take a look into our `Hello.sol` contract we'll notice that event `UpdateNumber` will be emitted everytime when `update` is called. If our dapp subscribes to event `UpdateNumber` we can always display the new value immediately when it gets updated.

```js
// Subscribe to "UpdateNumber" event in order to have "value" updated automatically
contractReader.events.UpdateNumber({}, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('[Event] UpdateNumber', data.returnValues.value);
  valueDisplayElement.textContent = data.returnValues.value;
});
```

When the update button is clicked, send transaction to invoke the `update` function in the contract
```js
  // Call "update" function in the contract when we click on the update button
  const updateButton = document.getElementById('update');
  updateButton.onclick = async () => {
    if (contractWriter && myAccount) {
      await contractWriter.methods.update().send({
        from: myAccount,
      });
    }
  }
``` 

That's pretty much of it :) We have a simple dapp which shows the `value` variable in the contract and it updates automatically. 
