# 09 Sync data by observing transactions

Official truffle suite provides a package called [Drizzle](https://truffleframework.com/drizzle). 
Drizzle takes care of synchronizing the contract data with a Redux store (in your dapp). 

Let's take a look of how Drizzle does it under the hood. The concept will be helpful to our architecture design.

First of all: 
- deploy a new contract to DEXON testnet by `npm run migrate:testnet`
- rebuild the app so it contains the new contract address: `npm run build:webapp`
- serve files under `./dist`
- Open up your browser and choose `DEXON Test Network` in DekuSan wallet

Now find this part in `./app/app.js`
```js
/**
  Chapter 09 starts from here
*/
const inputDataDecoder = await import('ethereum-input-data-decoder');
const decoder = new inputDataDecoder.default(abi);
```
The app is a copy from chapter `05` and then we cancel the event subscription.
We also import a new library `ethereum-input-data-decoder` which will be used later.

Basically what Drizzle does is watching the new `block headers`:
- When there's a new `block header` comming, get `block info` from the `header`
- Inside of the `block info` you find the `transactions` with this block
- Compare the `from` and `to` of each transaction
- If either `from` or `to` matches contract address, that means someone is interacting with the contract
- use `decoder.decodeData` to decode the transaction input

```js
// watching the incomming new blocks
wsHandler.eth
  .subscribe('newBlockHeaders')
  .on('data', async (header) => {
    const block = await wsHandler.eth.getBlock(header.number, true);
    const { transactions } = block;

    // parse all the txs within this block
    transactions.forEach((tx) => {
      // console.log(`${tx.from} to ${tx.to}`);
      const { from, to, input } = tx;
      if (!from || !to) {
        return;
      }
      if ((from === address) || (to === address)) {
        const res = decoder.decodeData(input);
        // We should see which function is being called with what parameters
        console.log(res);

        // Update UI
        const val = await contractReader.methods.value().call();
        valueDisplayElement.textContent = val;
      }
    });
  });
```

Open up your developer console and it's time to click `Update Value`. You'll see the following:
```js
{name: "update", types: [], inputs: []}
```
- `name` is the function name
- `types` are parameter types
- `inputs` will be the actual data passed to the function

Awesome! From now on whoever calls our contract we will know immediately.

## And what now?

The above way gives us some pros and cons

### pros
- We don't need to keep emitting events and still keeps the reactivity
  - Dapp will know by itself
  - It speed up contract development a bit
  - Save some gas
  - Of course we still log events which are meant to be logged
- We don't rely on events but we don't need to poll
- You can now design your data syncing strategy
  - Easily defined the minimum variables to update if a certain function is called
  - and you can do it for events we well

### Cons
- Extra computation
  - May be okay for current Ethereum because the TPS isn't that high
  - DEXON is aimed to be high TPS and low latency so that computation effort could be huge
  - JavaScript is running in single thread, we have to make sure it won't block other tasks

so maybe we should move it to different thread?

Modern browsers supports [web worker](https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Workers_API/Using_web_workers) which runs tasks in a different thread so it will not block the main thread (for example, UI update might be smoother). 
We can move the subscription of `newBlockHeaders` into web worker and only notify the main thread if there's something we are interested in.
