pragma solidity 0.8.0;

// import "hardhat/console.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

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
    function flashLoan(address receiverAddress, address[] calldata assets, uint256[] calldata amounts, uint256[] calldata modes, address onBehalfOf, bytes calldata params, uint16 referralCode) external;
    function getUserAccountData(address user) external;
}

contract Aavetrage {
    
    IAaveV1AddressProvider public aaveV1AddressProvider;
    IAaveV2AddressProvider public aaveV2AddressProvider;

    event UserLTV(address user, uint256 ltv);

    constructor(
        address _v1AddressProvider,
        address _v2AddressProvider
    ) public {
        aaveV1AddressProvider = IAaveV1AddressProvider(_v1AddressProvider);
        aaveV2AddressProvider = IAaveV2AddressProvider(_v2AddressProvider);
    }


    function AaveV2LeveragedDeposit(
        address collateralAddress, uint256 collateralAmount, address borrowAddress, uint256 borrowAmount, uint256 loops
    ) public {

        IAaveV2LendingPool v2LendingPool = IAaveV2LendingPool(aaveV2AddressProvider.getLendingPool());
        require(IERC20(collateralAddress).transferFrom(msg.sender, address(this), collateralAmount), "failed to transfer collateral to contract");

        IERC20(collateralAddress).approve(address(v2LendingPool), collateralAmount);
        v2LendingPool.deposit(collateralAddress, collateralAmount, msg.sender, 0);

        IERC20(borrowAddress).approve(address(v2LendingPool), borrowAmount*loops);
        // is there ever a reason to actually do the loop? I think this can be just raw values
        for (uint i = 0; i < loops; i++) {
            v2LendingPool.borrow(borrowAddress, borrowAmount, 1, 0, msg.sender);
            v2LendingPool.deposit(borrowAddress, borrowAmount, msg.sender, 0);
        }
    }
}