// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract RoadAlert{
    address dev = 0xEd4Ba4D1b51A33aDb6ad579a9A6AceFfa889bff2;
    address price = 0x1351ae85D96624D76e7cCd092c102268a4c9a844;         
    uint256 amount_per_hit;//dollar*10^18
    uint public hits = 0;
    address owner;
    mapping(address => uint) viewer;
    int32[50] longitude;
    int32[50] latitude;
    
    uint256 public viewcost;//dollar*10^18

    receive() external payable {

    }

    constructor(uint256 _amount_per_hit,uint256 _viewcost) {
        owner = msg.sender;
        amount_per_hit = _amount_per_hit;        
        viewcost=_viewcost;
    }

    //

    //contributors
    function detected(int32 long,int32 lat) external {

        require((hits<50)&&(long<=180000000 && long>=-180000000 && lat<=90000000 && lat>=-90000000));
        //checking nearby detected points ~ > 10m distance
        for(uint i = 0;i<hits;i++){
            require((longitude[i]+latitude[i]-long-lat) >= 198,"too close");
                        
        }

        longitude[hits] = long;
        latitude[hits] = lat;
        hits = hits+1;

        if(msg.sender != owner){
             (bool success2,bytes memory result2) = price.call(abi.encodeWithSignature("getData()"));
            
            require(success2,"unable to convert");
            
            (,int256 answer, ,) = abi.decode(result2,(uint,int256,uint80,uint8));
            
            payable(msg.sender).transfer((amount_per_hit/uint256(answer))*10**8);
        }
        
        
    }

    function remove(uint16 index) external{
        
        require(msg.sender == owner);
        if( index < hits ){
            //checking nearby detected points ~ > 10m distance
            for(uint i = index;i<(hits-1);i++){
                longitude[i] = longitude[i+1];
                latitude[i] = latitude[i+1];
            }       
            hits--;      
        }

    }
    
    function getMarker(uint32 index) external view returns(int32 ,int32 ){
        require(msg.sender == owner);
        return(longitude[index],latitude[index]);
    }

    function viewMarkers() external payable{
        (bool success2,bytes memory result2) = price.call(abi.encodeWithSignature("getData()"));
            
        require(success2,"unable to convert");
        
        (,int256 answer, ,) = abi.decode(result2,(uint,int256,uint80,uint8));


        require(msg.value >= ((viewcost/uint256(answer))*10**8),"Payment not full.");
        (bool success,bytes memory result) = dev.call(abi.encodeWithSignature("viewrate()"));
        require(success,"no viewrate");
        
        (uint8 viewrate) = abi.decode(result,(uint8));
        uint256 comm = ((msg.value/100)*viewrate);
        payable(dev).transfer(comm);
        
        viewer[msg.sender] = block.timestamp;
    }

    function viewMarker(uint index) external  view returns(int32 ,int32 ){
        //time available
        uint time = ( block.timestamp - viewer[msg.sender])/86400;
        require(time<=1,"ended");
        return(longitude[index],latitude[index]);
    }

    function withdraw() external {
        require(owner == msg.sender);
        payable(owner).transfer(address(this).balance);
    }
    function changeOwner(address newowner) external{
        require(owner == msg.sender);
        owner = newowner;
    }
    
    function updateViewCost(uint256 _viewcost) external{
        require(owner == msg.sender);
        viewcost=_viewcost;
    }

}