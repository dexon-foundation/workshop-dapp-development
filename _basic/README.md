# Basic project setup

`dexon-truffle` and `dexon-ganache` are included in this project.
They are the fundamental tools we use to build Dapps on DEXON blocklattice.

Please take a look of `./package.json` for the detail of `npm run *` commands

Before we move on to the next one please make sure the following steps works successfully.

## 1. Installation

- please make sure `Node.js` is installed (https://nodejs.org/)
- run `npm install` - this will install all the dependencies we need under `/node_moudles/`

## 2. Compile Smart contract
- `npm run compile`
- output files will be under `./build/contract`

## 3. Start local RPC
- Please make sure you have pasted `Seed Words` from your DekuSan wallet
- By doing so we are able to use the same account to deploy contract to local RPC and DEXON testnet
- `npm run rpc` and you will see: `DEXON-ganacge: Test RPC running on port 8545`

## 4. Build Webapp
- We use `webpack` to bundle `./app/app.js` and injected it into `index.html`
- `npm run build:webapp`
- Output files will be under `./dist`

## 5. Serve Webapp
- Go to `./dist`
- Use any web server to server this folder
- For exmaple, if you have python installed
    - `python -m SimpleHTTPServer`
    - Then visit `http://localhost:8000` and you should be able to see the webapp
- Whenever you modify the dapp just rebuild it and reload the browser
- We recommned you to integrate `webpack-dev-server` to automize build and reload

