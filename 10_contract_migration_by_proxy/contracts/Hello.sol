pragma solidity ^0.5.1;

contract Hello {
    uint256 public value;

    event UpdateNumber(uint256 value, address updateBy);
    event receivedFund(uint256 value, address sender);

    function update() public {
        value += 1;
        emit UpdateNumber(value, msg.sender);
    }

    function get() public view returns (uint256) {
        return value;
    }

    function funding() public payable {
        emit receivedFund(msg.value, msg.sender);
    }
}