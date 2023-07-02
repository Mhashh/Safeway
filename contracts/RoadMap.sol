// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract RoadMap{
    
    address dev = 0x0000000000000000000000000000000000E50d23;
    address public owner;
    address alert;
    int32[10] public polygonLong;
    int32[10] public polygonLat;
    int8[50] public report;
    uint public hits = 0;
    mapping(address => uint) viewer;
    uint256 public balance=0;

    receive() external payable {

    }

    constructor() payable {
        (bool success,bytes memory result) = dev.call(abi.encodeWithSignature("rate()"));
        require(success,"no rate");
        
        (uint256 rate) = abi.decode(result,(uint256));
        require(rate == msg.value,"value wrong");
        payable(dev).transfer(rate);
        owner = msg.sender;
    }

    //get polygon coordinates
    function polygon(uint index) view public returns(int32 longitude,int32 latitude){
        require(index<hits && hits>0);
        return(polygonLong[index],polygonLat[index]);
    }

    //owner, region of map cover
    function addToPolygon(int32 long,int32 lat) external  {
        require(msg.sender == owner,"Not Owner");
        require((hits<100)&&(long>180000000 && long<-90000000 && lat>180000000 && lat<-90000000),"");

        polygonLong[hits] = long;
        polygonLong[hits] = lat;
        hits++;
    }

    //remove
    function remove(int8 value,uint16 index) public{
        
        if(msg.sender == owner){
            (bool success,) = alert.call(abi.encodeWithSignature("remove(uint16 index)",index));
            require(success);   
        }else{
            report[index] = (report[index]+value)/2;
        }

    }

    function addAlert(address _alert) public{
        require(owner == msg.sender);
        alert = _alert;
    }
    function addFund() external payable{
        balance += msg.value;
    }

    function withdraw() external payable {
        require(owner == msg.sender);
        payable(owner).transfer(balance);
    }

    function changeOwner(address newowner) external{
        require(owner == msg.sender);
        owner = newowner;
    }
}