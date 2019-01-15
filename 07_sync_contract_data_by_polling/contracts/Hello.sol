pragma solidity ^0.5.1;

contract Hello {
    uint256 public value;

    function update() public {
        value += 1;
    }
}