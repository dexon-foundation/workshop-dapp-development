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

    // Get the list of all views
    const variableToPoll = abi.filter((item) => {
      return item.stateMutability === "view";
    });

    // This will be our object which data is in sync with contract
    const contractData = {};
    
    setInterval(async () => {
      const getEverything = variableToPoll.map((item) => {
        return (helloContract.methods[item.name]().call())
          .then((res) => {
            contractData[item.name] = res;
          });
      });

      // wait until all the response is returned
      await Promise.all(getEverything);
      console.log(contractData);
    }, 3000);


    // Call "update" function in the contract when we click on the update button
    const updateButton = document.getElementById('update');
    updateButton.onclick = async () => {
      myAccount = (await httpHandler.eth.getAccounts())[0];
      if (helloContract && myAccount) {
        await helloContract.methods.update().send({
          from: myAccount,
        });
      }
    }

  }
};

init();