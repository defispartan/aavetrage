pragma solidity 0.8.0;

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

interface IUniswapV2Router02 {
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

contract Aavetrage {
    
    IAaveV1AddressProvider public aaveV1AddressProvider;
    IAaveV2AddressProvider public aaveV2AddressProvider;
    IUniswapV2Router02 public uniswapV2Router02;
    uint16 private aaveV2ReferralCode  = 0;

    constructor(
        address _v1AddressProvider,
        address _v2AddressProvider,
        address _uniswapV2Router02
    ) public {
        aaveV1AddressProvider = IAaveV1AddressProvider(_v1AddressProvider);
        aaveV2AddressProvider = IAaveV2AddressProvider(_v2AddressProvider);
        uniswapV2Router02 = IUniswapV2Router02(_uniswapV2Router02);
    }


    /**
        Called by AaveV2 LendingPool
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    )
        external
        // override
        returns (bool)
    {
        address collateralAddress;
        uint256 collateralAmount;
        address borrowAddress;
        uint256 borrowAmount;
        address originalSender;

        (originalSender, collateralAddress, collateralAmount, borrowAddress, borrowAmount) = abi.decode(params, (address, address, uint256, address, uint256));

        /*
        (2) obtain collateral from originalSender if specified
         */
        if (collateralAmount > 0) {
            IERC20(collateralAddress).transferFrom(originalSender, address(this), collateralAmount);
        }

        /*
        (3) Swap borrowed funds into collateral asset
         */
        require(IERC20(borrowAddress).approve(address(uniswapV2Router02), borrowAmount), "failed to approve borrow amount");

        address[] memory path = new address[](2);
        path[0] = borrowAddress;
        path[1] = collateralAddress;

        uint256[] memory swapAmounts = uniswapV2Router02.swapExactTokensForTokens(
            borrowAmount,
            0,
            path,
            address(this),
            block.timestamp);

        uint256 totalCollateralBalance = collateralAmount + swapAmounts[1];

        /*
        (4) Deposit full collateral amount on behalf of originalSender
         */
        IAaveV2LendingPool v2LendingPool = IAaveV2LendingPool(aaveV2AddressProvider.getLendingPool());
        require(IERC20(collateralAddress).approve(address(v2LendingPool), totalCollateralBalance), "failed to approve v2LendingPool spending");

        v2LendingPool.deposit(
            collateralAddress, totalCollateralBalance,
            originalSender, aaveV2ReferralCode);
        
        return true;
    }

    function _encodeFlashloanParams(
        address originalSender,
        address collateralAddress, uint256 collateralAmount,
        address borrowAddress, uint256 borrowAmount
    ) internal returns (bytes memory) {
        return abi.encode(originalSender, collateralAddress, collateralAmount, borrowAddress, borrowAmount);
    }

    function _getV2LendingPool() internal returns (IAaveV2LendingPool) {
        return IAaveV2LendingPool(aaveV2AddressProvider.getLendingPool());
    }

    // prevents stack too deep errors
    function _runFlashLoan(address[] memory assets, uint256[] memory amounts, uint256[] memory modes, bytes memory params) internal {
        _getV2LendingPool().flashLoan(
            address(this),
            assets, amounts, modes,
            msg.sender,
            params,
            0);
    }

    function AaveV2LeveragedBorrow(
        address collateralAddress, uint256 collateralAmount, address borrowAddress, uint256 borrowAmount, uint256 loanMode
    ) public {

        address[] memory assets = new address[](1);
        uint256[] memory amounts = new uint256[](1);
        uint256[] memory modes = new uint256[](1);
        {
        assets[0] = address(borrowAddress);
        amounts[0] = uint256(borrowAmount);
        modes[0] = uint256(loanMode);
        }

        _runFlashLoan(assets, amounts, modes, _encodeFlashloanParams(msg.sender, collateralAddress, collateralAmount, borrowAddress, borrowAmount));
    }
}