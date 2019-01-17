
var Data = artifacts.require("Data");
var Logic = artifacts.require("Logic");

module.exports = async function(deployer) {
  await deployer.deploy(Data);
  await deployer.deploy(Logic);
  const DataContract = await Data.deployed();
  DataContract.setLogicContract(Logic.address);
};

/**

If we want to update the logic contract while keeping the current data contract,
we should create a new migration file and file name should begins with the next iteration number

for example: "3_update_logic_contract_20190120.js"

module.exports = async function(deployer) {
  await deployer.deploy(Logic);
  const DataContract = await Data.deployed();
  DataContract.setLogicContract(Logic.address);
};

*/
