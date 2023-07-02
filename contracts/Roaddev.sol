// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


contract Safewaydev{
    address public owner;
    uint256 public rate=500000000;
    uint8 public viewratep=10;
    constructor(){
        owner = msg.sender;
    }

    receive() external payable {

    }

    function updateRate(uint256 _rate) public{
        require(owner == msg.sender);
        rate= _rate;
        
    }

    function updateVRate(uint8 _rate) public{
        require(owner == msg.sender && _rate>0 && rate<30);
        viewratep = _rate;
        
    }
    function withdraw() public payable {
        require(owner == msg.sender);

        payable(owner).transfer(address(this).balance);
    }

} 