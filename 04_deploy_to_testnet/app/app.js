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
     */
    await window.dexon.enable();

    /**
     * 1. DekuSan wallet injects a global variable called 'dexon'
     * 2. 'dexon' is a HTTP provider which allows you to communicate with RPC server over HTTP
     * 3. By passing the provider to web3, we are now able to interact with DEXON
     */
    httpHandler = new Web3.default(window.dexon); // httpHandler allows us to interact with the DEXON network
    const networkID = await httpHandler.eth.net.getId();
    const contractInfo = (await import('../build/contracts/Hello.json')).default;
    const { abi, networks } = contractInfo;
    const address = networks[networkID].address;
    const helloContract = new httpHandler.eth.Contract(abi, address);
    // Get user account.
    const accountList = await httpHandler.eth.getAccounts();
    const myAccount = accountList[0];

    /**
      "Check contract balance" button
     */
    const checkBalanceButton = document.getElementById('check');
    checkBalanceButton.onclick = async () => {
      // Get balance in Dei
      const balance = await httpHandler.eth.getBalance(address);
      console.log(`Contract balance in dei: ${balance}`);
      // Covert from Dei to DXN
      const balanceInDXN = Web3.utils.fromWei(balance);
      console.log(`Contract balance in DXN: ${balanceInDXN}`);
      alert(`Contract balane: ${balanceInDXN} DXN`);
    }

    /**
      send DXN nutton
     */
    const sendButton = document.getElementById('send');
    sendButton.onclick = async () => {
      const amount = prompt('How much DXN do u want to pay');
      console.log(`You want to pay ${amount} DXN`);
      /**
        We should transform the unit from DXN to Dei
        1 Dei = 1 Wei 
        1 Dxn = 1000000000000000000 Dei
       */
      const amountInDei = Web3.utils.toWei(amount);
      console.log('This is how much we should pay in wei', amountInDei);
      await helloContract.methods.funding().send({
        from: myAccount,
        value: amountInDei,
      });
    }
    
  }
};

init();