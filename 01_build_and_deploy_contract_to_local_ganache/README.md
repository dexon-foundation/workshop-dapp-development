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
Starting migrations...
======================
> Network name:    'development'
> Network id:      5777
> Block gas limit: 6721975

......

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
