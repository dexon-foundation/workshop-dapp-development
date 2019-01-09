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
 
  if (window.dexon) {

    /**
     * Request approval to read account address from DekuSan wallet
     * You can skip it if you don't need to know user's address
     */
    await window.dexon.enable();
    
    /**
     * 1. DekuSan wallet injects a global variable called 'dexon'
     * 2. 'dexon' is a HTTP provider which allows you to communicate with RPC server over HTTP
     * 3. By passing the provider to web3, we are now able to interact with DEXON
     */
    httpHandler = new Web3.default(window.dexon); // httpHandler allows us to interact with the DEXON network

    // Get the ID of the network which DekuSan wallet is currently connecting to
    const networkID = await httpHandler.eth.net.getId();
    console.log(networkID); // 5777 for local rpc, 238 for DEXON testnet
  }
};

init();