module.exports = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_v1AddressProvider",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_v2AddressProvider",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_uniswapV2Router02",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "collateralAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "collateralAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "borrowAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "borrowAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "loanMode",
        "type": "uint256"
      }
    ],
    "name": "AaveV2LeveragedBorrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "aaveV1AddressProvider",
    "outputs": [
      {
        "internalType": "contract IAaveV1AddressProvider",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "aaveV2AddressProvider",
    "outputs": [
      {
        "internalType": "contract IAaveV2AddressProvider",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "assets",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "premiums",
        "type": "uint256[]"
      },
      {
        "internalType": "address",
        "name": "initiator",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "params",
        "type": "bytes"
      }
    ],
    "name": "executeOperation",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "uniswapV2Router02",
    "outputs": [
      {
        "internalType": "contract IUniswapV2Router02",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];