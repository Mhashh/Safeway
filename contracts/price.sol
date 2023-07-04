// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface AggregatorV3Interface {
    /**
     * Returns the decimals to offset on the getLatestPrice call
     */
    function decimals() external view returns (uint8);

    /**
     * Returns the description of the underlying price feed aggregator
     */
    function description() external view returns (string memory);

    /**
     * Returns the version number representing the type of aggregator the proxy points to
     */
    function version() external view returns (uint256);

    /**
     * Returns price data about a specific round
     */
    function getRoundData(uint80 _roundId) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);

    /**
     * Returns price data from the latest round
     */
    function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

contract temp{
    address constant chainlink = 0x0BAA6E884cfD628b33867F9E081B44a76276fA2D;

    function getData() public view returns(uint,int256,uint80,uint8){
        AggregatorV3Interface ab = AggregatorV3Interface(chainlink);
        (uint id,int256 answer,,,uint80 answer2)=ab.latestRoundData();
        (uint8 dec) = ab.decimals();
        return (id,answer,answer2,dec);
    }
}