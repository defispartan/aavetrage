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