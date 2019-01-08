# 01 Build and Deploy Smart Contract to local rpc

1. Have your local rpc running by `npm run rpc`

2. Remove `./build` and run `npm run compile`

3. Check the json files under `./build/contracts`
    -   In the `network` section. It should be empty (We haven't deployed the contract to any network yet)

4. Run this new command: `npm run migrate:development`
    - If you look into `package.json`, it is actually running as: `dexon-truffle migrate --network=development --reset`
    - `--network=development` tells dexon-truffle to use `development` network defined in `truffle-config.js`
    - `--reset` means running all the scripts under `migrations`. If you don't have `--reset` specified, you will need to create a new migration file
    - We will get to `migrations` later. For now we can specify `--reset` and always use the same migration file

5. You should be able to see output like the follwing:
```
Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x84603efd4bec30f84f89e3c94399b52e64d276055bd88629ace3dfc667ae5a18
  Migrations: 0x5cca560decb6cd5f253a54c2a8963e7cec79f6ba
Saving successful migration to network...
  ... 0x8ee49062d3313d2bd67e399b07d1db757d57723305b990f2a149214c39316f11
Saving artifacts...
Running migration: 2_deploy_Hello.js
  Deploying Hello...
  ... 0xb0a1bb7b26de7c9e12eb6328a5b33be69fec75638e7bb281e0625c40a98be093
  Hello: 0x379a44f8e51cb2ac6b231b893a936cfc42470c35
Saving successful migration to network...
  ... 0x513d6b653f0d70a461ad9227c2829aa9ee2c34768f96f740b0cdf66baffa495b
Saving artifacts...
```
6. Check the json files under `./build/contracts` again
    -   In the `network` section, we should see that information of a new network is added
    ```js
    "networks": {
        "5777": {
            "events": {},
            "links": {},
            "address": "0x379a44f8e51cb2ac6b231b893a936cfc42470c35",
            "transactionHash": "0xb0a1bb7b26de7c9e12eb6328a5b33be69fec75638e7bb281e0625c40a98be093"
        }
    },
    ```
    - 5777 is the network id of local rpc. DEXON testnet should be `238`
    - Dapp can refer to this file to know the contract address of each network
