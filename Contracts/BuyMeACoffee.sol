// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeACoffee {
   
event newMemo(
    address indexed from,
    uint256 timestamp,
    string name,
    string message
);
struct Memo{
    address from;
    uint256 timestamp;
    string name;
    string message;
}

//List of all memos
Memo[] memos; 

//Address of contract deployer
address payable owner;

constructor(){
    owner=payable(msg.sender);
}

function buyCoffee(string memory _name,string memory _message) public payable {
require(msg.value>0,"can't buy a coffee with 0 eth");
memos.push(Memo(msg.sender,block.timestamp,_name,_message));
emit newMemo(msg.sender,block.timestamp,_name,_message);
}

function withdrawTips() public {
    require(owner.send(address(this).balance));
}

//Get all the memos stored in the blockchain
function getMemos() public view returns(Memo[] memory){
   return memos;
}

}
