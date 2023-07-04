// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract RoadMap{
    
    address dev = 0xEd4Ba4D1b51A33aDb6ad579a9A6AceFfa889bff2;
    address price = 0x1351ae85D96624D76e7cCd092c102268a4c9a844;
    address public owner;
    address public alert;
    int32[10] public polygonLong;
    int32[10] public polygonLat;
    int8[50] public report;
    uint public hits = 0;
    mapping(address => uint) viewer;

    receive() external payable {

    }

    constructor() payable {
        (bool success,bytes memory result) = dev.call(abi.encodeWithSignature("rate()"));
        require(success,"no rate");
        
        (uint256 rate) = abi.decode(result,(uint256));
        (bool success2,bytes memory result2) = price.call(abi.encodeWithSignature("getData()"));

        require(success2,"unable to convert");
        (,int256 answer, ,uint8 dec) = abi.decode(result2,(uint,int256,uint80,uint8));

        //usd * 10^18
        uint256 doll = ((msg.value/(10**9))*uint256(answer*int256(10**(18-dec))))/(10**9);
        require(rate <= doll,"value less");
        payable(dev).transfer((rate/uint256(answer))*10**dec);
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
        require((hits<100)&& (long<=180000000 && long>=-90000000 && lat<=180000000 && lat>=-90000000),"range");

        polygonLong[hits] = long;
        polygonLat[hits] = lat;
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

    function withdraw() external {
        require(owner == msg.sender);
        payable(owner).transfer(address(this).balance);
    }

    function changeOwner(address newowner) external{
        require(owner == msg.sender);
        owner = newowner;
    }
}