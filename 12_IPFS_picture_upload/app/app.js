console.log('WELCOME TO DEXON WORKSHOP');
const fileReaderPullStream = require('pull-file-reader')

const init = async () => {

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
    // console.log(file);
  }

};

init();