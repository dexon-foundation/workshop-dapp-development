pragma solidity ^0.5.1;

/**
  Data-logic separation pattern
*/

contract Data {
  address owner;
  address logicContract;

  mapping(address => uint) public numbers;

  constructor() public {
    owner = msg.sender;
  }

  function setNumber(address user, uint256 num) onlyLogicContract external {
    numbers[user] = num;
  }
  function getNumber(address user) external view returns(uint256) {
    return numbers[user];
  }

  function setLogicContract(address _addr) onlyOwner public {
    logicContract = _addr;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  modifier onlyLogicContract() {
    require(msg.sender == logicContract);
    _;
  }
}

contract Logic {

  Data public data;
  address owner;

  constructor(address _data) public {
    data = Data(_data);
    owner = msg.sender;
  }

  function setNumber(uint256 num) public {
    data.setNumber(msg.sender, num);
  }

  function getNumber(address addr) view public returns(uint256 num) {
    return data.getNumber(addr);
  }

  function setDataContract(address _data) public {
    data = Data(_data);
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

}