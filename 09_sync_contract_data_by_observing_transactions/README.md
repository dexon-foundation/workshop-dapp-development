# 09 Sync data by observing transactions

Official truffle suite provides a package called [Drizzle](https://truffleframework.com/drizzle). 
Drizzle takes care of synchronizing the contract data with a Redux store (in your dapp). 

Let's take a look of how Drizzle does it under the hood.

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
The app is a copy from chapter `05` and then we add things to the bottom.
We also import a new library `ethereum-input-data-decoder` which helps us later

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
        console.log(res);
      }
    });
  });
```

Open up your developer console and it's time to click `Update Value`. You'll see the following:
```js
{name: "update", types: [], inputs: []}
```

Awesome! From now on whoever calls our contract we will know immediately.


