console.log('WELCOME TO DEXON WORKSHOP');
const fileReaderPullStream = require('pull-file-reader');
const IpfsHttpClient = require('ipfs-http-client');

const init = async () => {

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

  contractReader = new wsHandler.eth.Contract(abi, address);

  // contractWriter is created from httpHandler
  if (httpHandler) {
    contractWriter = new httpHandler.eth.Contract(abi, address);
  }

  // IPFS initialization!!
  const ipfs = IpfsHttpClient({ 
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
   });

  document.getElementById('upload').onchange = async ({ target }) => {
    document.getElementById('ipfsHash').innerText = 'IPFS uploading...';
    document.getElementById('base64').innerText = '';
    const file = target.files[0];
    const fileStream = fileReaderPullStream(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      document.getElementById('preview').src = reader.result;
      console.log(reader.result.length);
      document.getElementById('base64').innerText = `Base64: ${reader.result.length} characters`;
    }

    const t = await ipfs.add(fileStream, { progress: p => console.log(`progress ${p}`) });
    console.log(t);
    document.getElementById('ipfsHash').innerHTML = `IPFS Hash: <a href="https://gateway.ipfs.io/ipfs/${t[0].hash}">${t[0].hash}</a>`;
    console.log(myAccount);
    contractWriter.methods.upload(t[0].hash).send({ from: myAccount });
    // console.log(file);
  }

  const renderEventList = (data) => {
    console.log('data', data);
    const wrapper = document.getElementById('uploaded');
    wrapper.innerHTML = '';
    data.forEach(it => {
      const Image = document.createElement('img');
      Image.style = 'display: float; max-height: 100px; max-width: 300px; margin: 30px;';
      Image.src = `https://gateway.ipfs.io/ipfs/${it.ipfsHash}`;
      wrapper.appendChild(Image);
    });
  }

  const events = await contractReader.getPastEvents(
    'ImageUploaded', 
    {
      fromBlock: '0',
      toBlock: 'latest',
    }
  );
  const eventList = events.map(it => it.returnValues);
  console.log(eventList);
  renderEventList(eventList);
  contractReader.events.ImageUploaded({}, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('[Event] image uploaded', data.returnValues);
    eventList.push(data.returnValues);
    renderEventList(eventList);
  });


};

init();