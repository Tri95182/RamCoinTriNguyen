pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/price/IncreasingPriceCrowdsale.sol";

contract RamSale is Crowdsale, MintedCrowdsale, CappedCrowdsale, TimedCrowdsale, IncreasingPriceCrowdsale  {

    // Track investor contributions
    uint256 public investorMinCap =  1000000000000000000; // 1 ether
    uint256 public investorHardCap = 3000000000000000000; // 3 ether
    mapping(address => uint256) public contributions;

    constructor(
        uint256 _rate,
        address _wallet,
        ERC20 _token,
        uint256 _initialRate,
        uint256 _finalRate,
        uint256 _cap,
        uint256 _openingTime,
        uint256 _closingTime
    )

    Crowdsale(_rate, _wallet, _token)
    IncreasingPriceCrowdsale(_initialRate, _finalRate)
    CappedCrowdsale(_cap)
    TimedCrowdsale(_openingTime, _closingTime)

    public
    {

    }


    /**
    * @dev Returns the amount contributed so far by a sepecific user.
    * @param _beneficiary Address of contributor
    * @return User contribution so far
    */
    function getUserContribution(address _beneficiary)
    public view returns (uint256)
    {
        return contributions[_beneficiary];
    }

      /**
       * @dev Extend parent behavior requiring purchase to respect investor min/max funding cap.
       * @param _beneficiary Token purchaser
       * @param _weiAmount Amount of wei contributed
       */


    function _preValidatePurchase(
        address _beneficiary,
        uint256 _weiAmount
        )
        internal
        {
            super._preValidatePurchase(_beneficiary, _weiAmount);
            uint256 _existingContribution = contributions[_beneficiary];
            uint256 _newContribution = _existingContribution.add(_weiAmount);
            require(_newContribution >= investorMinCap && _newContribution <= investorHardCap);
            contributions[_beneficiary] = _newContribution;
        }


    function finalization() internal {
        MintableToken _mintableToken = MintableToken(token);
        _mintableToken.finishMinting();
    }

    function getNow() public view returns (uint256) {
        return block.timestamp;
    }
}