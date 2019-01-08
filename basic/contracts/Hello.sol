pragma solidity ^0.4.25;

contract Hello {
    uint256 public value;

    event UpdateNumber(uint256 _value);

    function update() public {
        value = rand;
        emit UpdateNumber(value);
    }

    function get() public view returns (uint256) {
        return value;
    }
}