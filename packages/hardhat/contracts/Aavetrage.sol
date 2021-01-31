pragma solidity 0.8.0;

interface IAaveV1AddressProvider {
    function getLendingPool() external view returns (address);
}

interface IAaveV2AddressProvider {
    function getAddress(bytes32 id) external view returns (address);
    function getLendingPool() external view returns (address);
}

interface IAaveV1LendingPool {
    function deposit( address _reserve, uint256 _amount, uint16 _referralCode) external;
    function borrow(address _reserve, uint256 _amount, uint256 _interestRateMode, uint16 _referralCode) external;
    function repay( address _reserve, uint256 _amount, address payable _onBehalfOf) external;
}

interface IAaveV2LendingPool {
    function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external;
    function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external;
    function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf) external;
}

contract Aavetrage {
    
    IAaveV1AddressProvider public aaveV1AddressProvider;
    IAaveV2AddressProvider public aaveV2AddressProvider;


    constructor(
        address _v1AddressProvider,
        address _v2AddressProvider
    ) public {
        aaveV1AddressProvider = IAaveV1AddressProvider(_v1AddressProvider);
        aaveV2AddressProvider = IAaveV2AddressProvider(_v2AddressProvider);
    }

    /**
    assumes user is properly approved for each token and already has sufficient collateral on V1.
    */
    function borrowAaveV1DepositV2(
        address v1TokenAddress, uint256 v1TokenAmount, uint256 v1InterestRateMode, uint16 v1ReferralCode,
        address v2TokenAddress, uint256 v2TokenAmount, uint256 v2InterestRateMode, uint16 v2ReferralCode)
        public
    {

        IAaveV1LendingPool v1LendingPool = IAaveV1LendingPool(aaveV1AddressProvider.getLendingPool());
        IAaveV2LendingPool v2LendingPool = IAaveV2LendingPool(aaveV2AddressProvider.getLendingPool());

        // borrow on v1 and deposit to v2
        // note: this doesnt work, since when we call v1.borrow, this contract is msg.sender
        v1LendingPool.borrow(v1TokenAddress, v1TokenAmount, v1InterestRateMode, v1ReferralCode);
        v2LendingPool.deposit(v2TokenAddress, v2TokenAmount, msg.sender, v2ReferralCode);

        return;
    }
}