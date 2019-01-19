pragma solidity ^0.5.1;

contract Hello {
    event ImageUploaded(string ipfsHash, address sender);

    function upload(string memory imageHash) public {
        emit ImageUploaded(imageHash, msg.sender);
    }
}