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
  let netId;
  let myAccount;

  if (window.dexon) {
    await window.dexon.enable();
    httpHandler = new Web3.default(window.dexon);
    netId = await httpHandler.eth.net.getId();
    myAccount = (await httpHandler.eth.getAccounts())[0];
  }

  const Logic = (await import('../build/contracts/Logic.json')).default;

  // If there's no netId, we use 238 as default network
  const address = Logic.networks[netId || 238].address;
  document.getElementById('logic').textContent = address;

  let contractHandler = new httpHandler.eth.Contract(Logic.abi, address);
  const dataAddress = await contractHandler.methods.data().call();
  document.getElementById('data').textContent = dataAddress;

  const getValueButton = document.getElementById('get');
  getValueButton.onclick = async () => {
    const myValue = await contractHandler.methods.getNumber(myAccount).call();
    alert(myValue);
  }

  const updateValueButton = document.getElementById('update');
  updateValueButton.onclick = async () => {
    const num = prompt('Input a number to update');
    await contractHandler.methods.setNumber(num).send({
      from: myAccount,
    });
    alert('done');
  }

};

init();