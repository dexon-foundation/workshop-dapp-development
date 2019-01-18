# 10 Contract Migration - Logic/data separation pattern 

In order to be able to upgrade our contract, we need to separate the logic and the data.

Now we have a new contract file `./contracts/Contract.sol` which contains two contracts, `Data` and `Logic`

```js
// Contract.sol

contract Data {
  //...
}

contract Logic {
  //...
}
```

In this tutorial, our dapp interacts with `Logic` contract and `Logic` contract set and read data from `Data` contract

`Logic` contract should:
- have the address of `data` contract
- can update the address of `data` contract

`Data` contract should:
- only allow `Logic` contract to set its data

We have two contracts to deploy and both of them needs to know each other's address. How would it affect the initial delpoy process?

First, we should remove the `--reset` flag of `dexon-truffle migrate` command

You might have noticed, each migration file has its name begins with a number (`2_delpoy_contract.js`). It's because normally we should wrtie a new migration file each time we want to delpoy a new version. Since the file name begin with a number, trufffle will remember the previous number and only execute the new migration file. (migration number is remembered inside of the migration contact).  

If `--reset` flag exists, truffle will execute all migration files again. That's why we need to remove it.

So how do we write our first migration file?

```js
var Data = artifacts.require("Data");
var Logic = artifacts.require("Logic");

module.exports = async function(deployer) {
  // depliy data first
  await deployer.deploy(Data);

  // deploy logic and passed in Data contract's address
  await deployer.deploy(Logic, Data.address);

  // After Logic contract is deployed, call "setLogicContract" in the Data contract
  const DataContract = await Data.deployed();
  DataContract.setLogicContract(Logic.address);
};
```
After the execution `Data` and `Logic` contract are deployed and we should not execute this file again (unless we want to start all over)

Maybe few weeks later we find a bug inside of `Logic` contract so we need to deploy a new one (while `Data` contract remins the same). We should:
1. Create a new migration file, maybe this time we call it `3_update_logic_contract_20190120.js`
2. Deploy `Logic` contract only, and passed in the same address of `Data` contract
3. Call `setLogicContract()` from `Data` contract and pass in the new address of `Logic` contract
```js
var Data = artifacts.require("Data");
var Logic = artifacts.require("Logic");

module.exports = async function(deployer) {
  await deployer.deploy(Logic, Data.address);
  const DataContract = await Data.deployed();
  DataContract.setLogicContract(Logic.address);
};
```
