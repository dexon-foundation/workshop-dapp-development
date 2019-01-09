console.log('WELCOME TO DEXON WORKSHOP');

const init = async () => {
  console.log('Basic UI is rendered. Time to load Web3');
  const Web3 = await import('web3');
  console.log(Web3);
};

init();