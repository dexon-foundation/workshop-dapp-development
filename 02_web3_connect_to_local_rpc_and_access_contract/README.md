# 02 Use web3 to connect to local rpc and access contract

If you look into the `dependencies` section of the `package.json` file you will noticed that `web3` is added. From now one, whenever you run `npm install` and `web3` will be installed as one of our dependencies. (you can find it under `node_moudles`)

Now it's time to include `web3` in our dapp entry file: `./app/app.js`
```js
const init = async () => {
  console.log('Basic UI is rendered. Time to load Web3');
  const Web3 = await import('web3');
  console.log(Web3);
};
init();
``
We are loading `Web3` asynchronously 

After running `npm run build:webapp` and open our dapp in the browser. We should see the `web3` object being printed in the developer console
