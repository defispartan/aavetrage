# Aavetrage On-Chain Components

## Setup

For development, fork mainnet at a specific block (`11758750`) set up a 

1) create an account at https://alchemyapi.io/ (free)
2) set the API key environtment variable `ALCHEMY_KEY`
3) now the forked mainnet will be available at `http://127.0.0.1:8545/` when you run `yarn chain`

Ensure that the forked blockchian is at the forked block:
```
~/aavetrage/packages/hardhat
$ npx hardhat console

Welcome to Node.js v12.18.3.
Type ".help" for more information.
> await ethers.provider.getBlockNumber()
11758750
```

## Development

Alchemy is nice and free, but rate limits make running tests on a forked chain
almost impossible. So dev is a bit more efficient by doing hardhat tasks instead.
(maybe i should just read the docs and figure out how to run individual tests)


### Example using hardhat to deposit some collateral (ETH) and take out a borrow (DAI).
```
$ npx hardhat aaveV1DepositETHBorrowDAI 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

starting balance: 10000.0 ETH
starting balance: 0.0 DAI
Account Health Before Deposit
User account data for address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
 totalLiquidityETH:           0.0 ETH
 totalCollateralETH:          0.0 ETH
 totalBorrowsETH:             0.0 ETH
 totalFeesETH:                0.0 ETH
 availableBorrowsETH:         0.0 ETH
 currentLiquidationThreshold: 0.0 ETH
 ltv:                         0
 healthFactor:                115792089237316195423570985008687907853269984665640564039457.584007913129639935 ETH

Aave V1 deposit transaction:
{
  hash: '0x1c65e9092891cebeb2d9e076620264a84c71707b959aff13f444772dfd047a3f',
  blockHash: '0x92174e80ffc70925a242e7883bda972adcfe1b6a1c8a427d7844053d71e5bdc2',
  blockNumber: 11758751,
  transactionIndex: 0,
  confirmations: 1,
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  gasPrice: BigNumber { _hex: '0x01dcd65000', _isBigNumber: true },
  gasLimit: BigNumber { _hex: '0x031d66', _isBigNumber: true },
  to: '0x398eC7346DcD622eDc5ae82352F02bE94C62d119',
  value: BigNumber { _hex: '0x056bc75e2d63100000', _isBigNumber: true },
  nonce: 0,
  data: '0xd2d0e066000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000056bc75e2d631000000000000000000000000000000000000000000000000000000000000000000000',
  r: '0x4f8968979c34125f3661fbc16162c86fd104acef9a859e74a8c031f2a91fff04',
  s: '0x42706f42db4120358917f57ee2813d1b651e3e2e4b7169965603bc1bb628a092',
  v: 62709,
  creates: null,
  chainId: 31337,
  wait: [Function]
}
Aave V1 borrow DAI transaction:
{
  hash: '0xb4ef5778c04948efc85299b5672df73c6f09953d696a072d9afd44de89085d5e',
  blockHash: '0x54770a235d358c0610b408cf80cf7f80d3d79319ad24b76671c580d7e782dc3f',
  blockNumber: 11758752,
  transactionIndex: 0,
  confirmations: 1,
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  gasPrice: BigNumber { _hex: '0x01dcd65000', _isBigNumber: true },
  gasLimit: BigNumber { _hex: '0x093ddd', _isBigNumber: true },
  to: '0x398eC7346DcD622eDc5ae82352F02bE94C62d119',
  value: BigNumber { _hex: '0x00', _isBigNumber: true },
  nonce: 1,
  data: '0xc858f5f90000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000dc3a8351f3d86a0000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000',
  r: '0x692ea13e962c48c4eb7841ad91f5e84d51fcef48e95280d0333772fdf9f4a414',
  s: '0x189c63ea2d54cf452cac9fac93462f36140149a85e2f9fdb376f9aa33fd6c2ff',
  v: 62710,
  creates: null,
  chainId: 31337,
  wait: [Function]
}

ending balance: 9899.993743376 ETH
starting balance: 65000.0 DAI
Account Health After Deposit
User account data for address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
 totalLiquidityETH:           100.000000054957141182 ETH
 totalCollateralETH:          100.000000054957141182 ETH
 totalBorrowsETH:             47.681075 ETH
 totalFeesETH:                0.0000047681075 ETH
 availableBorrowsETH:         27.318917541218328575 ETH
 currentLiquidationThreshold: 0.00000000000000008 ETH
 ltv:                         75
 healthFactor:                1.67781435389127675 ETH
```

### Example using hardhat to do a leveraged borrow (USDC as collateral, DAI as borrow)

The smart contract will:

1) `transferFrom` the `collateralAmount` from caller to the contract
2) swap flashedloaned asset for collateral asset (DAI -> USDC) via uniswap (`swappedCollateralAmount`)
3) deposit `swappedCollateralAmount + collateralAmount` on behalf of caller into Aave v2


Token approvals needed:
1) `collateralAsset` must be approved before calling Aavetrage contract
2) `stableDebtToken` for the underlying `borrowAsset` must be approved in order for the smart contract to take out a loan on the user's behalf
```
// need to make an approval for the borrow asset (on stableDebtToken) in order to incur flashloan
const reserveData = await v2LendingPool.getReserveData(daiAddress);
const stableDebtToken = new ethers.Contract(reserveData["stableDebtTokenAddress"], stableDebtTokenABI, fromSigner);
await stableDebtToken.approveDelegation(aavetrage.address, ethers.constants.MaxUint256);
```

Hardhat task output:
```
$ npx hardhat aavetrageV2LeverageBorrow 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

==========================
Health Factor before call
==========================================================
Aave V2 account data for address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
 totalCollateralETH:          0.0 ETH
 totalDebtETH:                0.0 ETH
 availableBorrowsETH:         0.0 ETH
 currentLiquidationThreshold: 0.0 ETH
 ltv:                         0
 healthFactor:                115792089237316195423570985008687907853269984665640564039457.584007913129639935
==========================================================
User providing 100,000 USDC as collateral, borrowing 300,000 DAI with flashloan
{
  hash: '0x5d9a375ace4939d0942a171a3251b1fb1b9d01bdaf2e2c932484cbd8786bd44a',
  blockHash: '0xfb87431f1f270c8ac89083bfbfbad6ed4e8ea693cb07c0f9c752362ed1ba6bd9',
  blockNumber: 11758756,
  transactionIndex: 0,
  confirmations: 1,
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  gasPrice: BigNumber { _hex: '0x01dcd65000', _isBigNumber: true },
  gasLimit: BigNumber { _hex: '0x8215f8', _isBigNumber: true },
  to: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  value: BigNumber { _hex: '0x00', _isBigNumber: true },
  nonce: 5,
  data: '0xeddf9879000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000174876e8000000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000003f870857a3e0e38000000000000000000000000000000000000000000000000000000000000000000001',
  r: '0x41711f59f7a75f050d41afdd85020bf2a604ca4f95b80d908cb37e2c0b382533',
  s: '0x887e12bb6535dfc40560b2d00e676b7416b377cbd17247c163f5c22fc82a7d77',
  v: 62709,
  creates: null,
  chainId: 31337,
  wait: [Function]
}
Health Factor after call
==========================================================
Aave V2 account data for address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
 totalCollateralETH:          288.088149204946449887 ETH
 totalDebtETH:                220.0665 ETH
 availableBorrowsETH:         10.40401936395715991 ETH
 currentLiquidationThreshold: 0.0000000000000085 ETH
 ltv:                         8000
 healthFactor:                1.112731500815455703
==========================================================
```