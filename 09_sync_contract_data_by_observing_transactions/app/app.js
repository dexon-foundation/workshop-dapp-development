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

  let httpHandler;
  let wsHandler;
  let netId;
  let myAccount;

  if (window.dexon) {
    await window.dexon.enable();
    httpHandler = new Web3.default(window.dexon);
    netId = await httpHandler.eth.net.getId();
    myAccount = (await httpHandler.eth.getAccounts())[0];
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

  wsHandler = new Web3.default(ws_endpoint);

  const contractInfo = (await import('../build/contracts/Hello.json')).default;
  const { abi, networks } = contractInfo;
  // If there's no netId, we use 238 as default network
  const address = networks[netId || 238].address;

  let contractReader;
  let contractWriter;

  // contractReader is created from wsHandler
  contractReader = new wsHandler.eth.Contract(abi, address);

  // contractWriter is created from httpHandler
  if (httpHandler) {
    contractWriter = new httpHandler.eth.Contract(abi, address);
  }

  // DOM Element to display "value" in contract
  const valueDisplayElement = document.getElementById('value');
  // Get current value and display it
  const val = await contractReader.methods.value().call();
  valueDisplayElement.textContent = val;

  // Call "update" function in the contract when we click on the update button
  const updateButton = document.getElementById('update');
  updateButton.onclick = async () => {
    if (contractWriter && myAccount) {
      await contractWriter.methods.update().send({
        from: myAccount,
      });
    }
  }

  /**
    Chapter 09 starts from here
  */

  const inputDataDecoder = await import('ethereum-input-data-decoder');
  const decoder = new inputDataDecoder.default(abi);

  // watching the incomming new blocks
  wsHandler.eth
    .subscribe('newBlockHeaders')
    .on('data', async (header) => {
      const blockInfo = await wsHandler.eth.getBlock(header.number, true);
      const { transactions } = blockInfo;
      // parse all the txs within this block
      transactions.forEach(async (tx) => {
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
};

init();