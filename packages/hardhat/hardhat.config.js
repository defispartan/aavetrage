const { utils } = require("ethers");
const fs = require("fs");
const chalk = require("chalk");

require("@nomiclabs/hardhat-waffle");

const { isAddress, getAddress, formatUnits, parseUnits } = utils;

/*
      📡 This is where you configure your deploy configuration for 🏗 scaffold-eth

      check out `packages/scripts/deploy.js` to customize your deployment

      out of the box it will auto deploy anything in the `contracts` folder and named *.sol
      plus it will use *.args for constructor args
*/

//
// Select the network you want to deploy to here:
//
const defaultNetwork = "hardhat";

function mnemonic() {
  try {
    return fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log("☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.")
    }
  }
  return "";
}

module.exports = {
  defaultNetwork,

  // don't forget to set your provider like:
  // REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
  // (then your frontend will talk to your contracts on the live network!)
  // (you will need to restart the `yarn run start` dev server after editing the .env)

  networks: {
    hardhat: {
      forking:{
        url: "https://eth-mainnet.alchemyapi.io/v2/"+process.env.ALCHEMY_KEY,
        blockNumber: 11758750
      }
    },
    localhost: {
      url: "http://localhost:8545",
      /*
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      */
    },

    rinkeby: {
      url: "https://rinkeby.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", //<---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    kovan: {
      url: "https://kovan.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", //<---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", //<---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", //<---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    goerli: {
      url: "https://goerli.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad", //<---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.5.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],

  },
};

const DEBUG = false;

function debug(text) {
  if (DEBUG) {
    console.log(text);
  }
}

task("wallet", "Create a wallet (pk) link", async (_, { ethers }) => {
  const randomWallet = ethers.Wallet.createRandom()
  const privateKey = randomWallet._signingKey().privateKey
  console.log("🔐 WALLET Generated as " + randomWallet.address + "")
  console.log("🔗 http://localhost:3000/pk#"+privateKey)
});


task("fundedwallet", "Create a wallet (pk) link and fund it with deployer?")
  .addOptionalParam("amount", "Amount of ETH to send to wallet after generating")
  .addOptionalParam("url", "URL to add pk to")
  .setAction(async (taskArgs, { network, ethers }) => {

    const randomWallet = ethers.Wallet.createRandom()
    const privateKey = randomWallet._signingKey().privateKey
    console.log("🔐 WALLET Generated as " + randomWallet.address + "")
    let url = taskArgs.url?taskArgs.url:"http://localhost:3000"

    let localDeployerMnemonic
    try{
      localDeployerMnemonic = fs.readFileSync("./mnemonic.txt")
      localDeployerMnemonic = localDeployerMnemonic.toString().trim()
    } catch (e) {
      /* do nothing - this file isn't always there */
    }

    let amount = taskArgs.amount?taskArgs.amount:"0.01"
    const tx = {
      to: randomWallet.address,
      value: ethers.utils.parseEther(amount)
    };

    //SEND USING LOCAL DEPLOYER MNEMONIC IF THERE IS ONE
    // IF NOT SEND USING LOCAL HARDHAT NODE:
    if(localDeployerMnemonic){
      let deployerWallet = new ethers.Wallet.fromMnemonic(localDeployerMnemonic)
      deployerWallet = deployerWallet.connect(ethers.provider)
      console.log("💵 Sending "+amount+" ETH to "+randomWallet.address+" using deployer account");
      let sendresult = await deployerWallet.sendTransaction(tx)
      console.log("\n"+url+"/pk#"+privateKey+"\n")
      return
    }else{
      console.log("💵 Sending "+amount+" ETH to "+randomWallet.address+" using local node");
      console.log("\n"+url+"/pk#"+privateKey+"\n")
      return send(ethers.provider.getSigner(), tx);
    }

});


task("generate", "Create a mnemonic for builder deploys", async (_, { ethers }) => {
  const bip39 = require("bip39")
  const hdkey = require('ethereumjs-wallet/hdkey');
  const mnemonic = bip39.generateMnemonic()
  if (DEBUG) console.log("mnemonic", mnemonic)
  const seed = await bip39.mnemonicToSeed(mnemonic)
  if (DEBUG) console.log("seed", seed)
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0
  let fullPath = wallet_hdpath + account_index
  if (DEBUG) console.log("fullPath", fullPath)
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = "0x" + wallet._privKey.toString('hex');
  if (DEBUG) console.log("privateKey", privateKey)
  var EthUtil = require('ethereumjs-util');
  const address = "0x" + EthUtil.privateToAddress(wallet._privKey).toString('hex')
  console.log("🔐 Account Generated as " + address + " and set as mnemonic in packages/hardhat")
  console.log("💬 Use 'yarn run account' to get more information about the deployment account.")

  fs.writeFileSync("./" + address + ".txt", mnemonic.toString())
  fs.writeFileSync("./mnemonic.txt", mnemonic.toString())
});

task("mine", "Looks for a deployer account that will give leading zeros")
  .addParam("searchFor", "String to search for")
  .setAction(async (taskArgs, { network, ethers }) => {

  let contract_address = ""
  let address;

  const bip39 = require("bip39")
  const hdkey = require('ethereumjs-wallet/hdkey');

  let mnemonic = ""
  while(contract_address.indexOf(taskArgs.searchFor)!=0){

    mnemonic = bip39.generateMnemonic()
    if (DEBUG) console.log("mnemonic", mnemonic)
    const seed = await bip39.mnemonicToSeed(mnemonic)
    if (DEBUG) console.log("seed", seed)
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0
    let fullPath = wallet_hdpath + account_index
    if (DEBUG) console.log("fullPath", fullPath)
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet._privKey.toString('hex');
    if (DEBUG) console.log("privateKey", privateKey)
    var EthUtil = require('ethereumjs-util');
    address = "0x" + EthUtil.privateToAddress(wallet._privKey).toString('hex')


    const rlp = require('rlp');
    const keccak = require('keccak');

    let nonce = 0x00; //The nonce must be a hex literal!
    let sender = address;

    let input_arr = [ sender, nonce ];
    let rlp_encoded = rlp.encode(input_arr);

    let contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');

    contract_address = contract_address_long.substring(24); //Trim the first 24 characters.


  }

  console.log("⛏  Account Mined as " + address + " and set as mnemonic in packages/hardhat")
  console.log("📜 This will create the first contract: "+chalk.magenta("0x"+contract_address));
  console.log("💬 Use 'yarn run account' to get more information about the deployment account.")

  fs.writeFileSync("./" + address + "_produces"+contract_address+".txt", mnemonic.toString())
  fs.writeFileSync("./mnemonic.txt", mnemonic.toString())
});

task("account", "Get balance informations for the deployment account.", async (_, { ethers }) => {
  const hdkey = require('ethereumjs-wallet/hdkey');
  const bip39 = require("bip39")
  let mnemonic = fs.readFileSync("./mnemonic.txt").toString().trim()
  if (DEBUG) console.log("mnemonic", mnemonic)
  const seed = await bip39.mnemonicToSeed(mnemonic)
  if (DEBUG) console.log("seed", seed)
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0
  let fullPath = wallet_hdpath + account_index
  if (DEBUG) console.log("fullPath", fullPath)
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = "0x" + wallet._privKey.toString('hex');
  if (DEBUG) console.log("privateKey", privateKey)
  var EthUtil = require('ethereumjs-util');
  const address = "0x" + EthUtil.privateToAddress(wallet._privKey).toString('hex')

  var qrcode = require('qrcode-terminal');
  qrcode.generate(address);
  console.log("‍📬 Deployer Account is " + address)
  for (let n in config.networks) {
    //console.log(config.networks[n],n)
    try {

      let provider = new ethers.providers.JsonRpcProvider(config.networks[n].url)
      let balance = (await provider.getBalance(address))
      console.log(" -- " + n + " --  -- -- 📡 ")
      console.log("   balance: " + ethers.utils.formatEther(balance))
      console.log("   nonce: " + (await provider.getTransactionCount(address)))
    } catch (e) {
      if (DEBUG) {
        console.log(e)
      }
    }
  }

});


async function addr(ethers, addr) {
  if (isAddress(addr)) {
    return getAddress(addr);
  }
  const accounts = await ethers.provider.listAccounts();
  if (accounts[addr] !== undefined) {
    return accounts[addr];
  }
  throw `Could not normalize address: ${addr}`;
}

task("accounts", "Prints the list of accounts", async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts();
  accounts.forEach((account) => console.log(account));
});

task("blockNumber", "Prints the block number", async (_, { ethers }) => {
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(blockNumber);
});

task("balance", "Prints an account's balance")
    .addPositionalParam("account", "The account's address")
    .setAction(async (taskArgs, { ethers }) => {
      const balance = await ethers.provider.getBalance(
          await addr(ethers, taskArgs.account)
      );
      console.log(formatUnits(balance, "ether"), "ETH");
    });

function send(signer, txparams) {
  return signer.sendTransaction(txparams, (error, transactionHash) => {
    if (error) {
      debug(`Error: ${error}`);
    }
    debug(`transactionHash: ${transactionHash}`);
    // checkForReceipt(2, params, transactionHash, resolve)
  });
}

task("send", "Send ETH")
  .addParam("from", "From address or account index")
  .addOptionalParam("to", "To address or account index")
  .addOptionalParam("amount", "Amount to send in ether")
  .addOptionalParam("data", "Data included in transaction")
  .addOptionalParam("gasPrice", "Price you are willing to pay in gwei")
  .addOptionalParam("gasLimit", "Limit of how much gas to spend")

  .setAction(async (taskArgs, { network, ethers }) => {
    const from = await addr(ethers, taskArgs.from);
    debug(`Normalized from address: ${from}`);
    const fromSigner = await ethers.provider.getSigner(from);

    let to;
    if (taskArgs.to) {
      to = await addr(ethers, taskArgs.to);
      debug(`Normalized to address: ${to}`);
    }

    const txRequest = {
      from: await fromSigner.getAddress(),
      to,
      value: parseUnits(
          taskArgs.amount ? taskArgs.amount : "0",
          "ether"
      ).toHexString(),
      nonce: await fromSigner.getTransactionCount(),
      gasPrice: parseUnits(
          taskArgs.gasPrice ? taskArgs.gasPrice : "1.001",
          "gwei"
      ).toHexString(),
      gasLimit: taskArgs.gasLimit ? taskArgs.gasLimit : 24000,
      chainId: network.config.chainId,
    };

    if (taskArgs.data !== undefined) {
      txRequest.data = taskArgs.data;
      debug(`Adding data to payload: ${txRequest.data}`);
    }
    debug(txRequest.gasPrice / 1000000000 + " gwei");
    debug(JSON.stringify(txRequest, null, 2));

    return send(fromSigner, txRequest);
});

task("aaveV1LoadLendingPoolAddress", "Fetch AaveV1 LendingPool Mainnet Address")
  .setAction(async (taskArgs, { network, ethers }) => {
      addressProviderABI = require("./contracts/external_abi/aave_v1/LendingPoolAddressesProvider.json");

      // this is mainnet address
      addressProvider = new ethers.Contract("0x24a42fD28C976A61Df5D00D0599C34c4f90748c8", addressProviderABI, ethers.getDefaultProvider());
      console.log("LendingPool address:", await addressProvider.getLendingPool());
  })


async function FetchAndLogAaveV1AccountHealth(lendingPool, address) {
  try {
      userAccountData = await lendingPool.getUserAccountData(address);
      console.log("==========================================================")
      console.log("Aave V1 account data for address:", address);
      console.log("", "totalLiquidityETH:          ", ethers.utils.formatEther(userAccountData.totalLiquidityETH), "ETH");
      console.log("", "totalCollateralETH:         ", ethers.utils.formatEther(userAccountData.totalCollateralETH), "ETH");
      console.log("", "totalBorrowsETH:            ", ethers.utils.formatEther(userAccountData.totalBorrowsETH), "ETH");
      console.log("", "totalFeesETH:               ", ethers.utils.formatEther(userAccountData.totalFeesETH), "ETH");
      console.log("", "availableBorrowsETH:        ", ethers.utils.formatEther(userAccountData.availableBorrowsETH), "ETH");
      console.log("", "currentLiquidationThreshold:", ethers.utils.formatEther(userAccountData.currentLiquidationThreshold), "ETH");
      console.log("", "ltv:                        ", userAccountData.ltv.toString()), "%";
      console.log("", "healthFactor:               ", ethers.utils.formatEther(userAccountData.healthFactor), "ETH");
      console.log("==========================================================")
  } catch (e) {
    console.log("☢️ Error:", e)
  }
  return "";
}

task("aaveV1DepositETHBorrowDAI", "[Aave V1]Deposit some ETH as collateral then borrow DAI")
  .addPositionalParam("address", "Address to deposit from")
  .setAction(async (taskArgs, { network, ethers }) => {
    addressProviderABI = require("./contracts/external_abi/aave_v1/LendingPoolAddressesProvider.json");
    lendingPoolABI = require("./contracts/external_abi/aave_v1/LendingPool.json");
    erc20ABI = require("./contracts/external_abi/common/erc20.json");

    const provider = await ethers.getDefaultProvider();
    const fromSigner = await ethers.provider.getSigner(taskArgs.address);

    // load contracts
    addressProvider = new ethers.Contract("0x24a42fD28C976A61Df5D00D0599C34c4f90748c8", addressProviderABI, provider);
    lendingPool = new ethers.Contract(await addressProvider.getLendingPool(), lendingPoolABI, fromSigner);
    daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    daiERC20 = new ethers.Contract(daiAddress, erc20ABI, fromSigner);

    console.log("")
    let startBalanceETH = await fromSigner.getBalance();
    console.log("starting balance:", ethers.utils.formatEther(startBalanceETH), "ETH");
    let startBalanceDAI = await daiERC20.balanceOf(taskArgs.address);
    console.log("starting balance:", ethers.utils.formatEther(startBalanceDAI), "DAI");
    console.log("Account Health Before Deposit")
    await FetchAndLogAaveV1AccountHealth(lendingPool, taskArgs.address);
    console.log("")

    // Deposit collateral to V1
    let depositAmount = ethers.utils.parseEther("100.0");
    console.log("Aave V1 deposit transaction:")
    let tx = await lendingPool.deposit(
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      depositAmount,
      0,
      {value: depositAmount}
      );
    console.log(tx);
    console.log("")

    // take out a DAI borrow Deposit collateral to V1
    let borrowAmount = ethers.utils.parseEther("65000.0"); // should be about 75% ltv
    console.log("Aave V1 borrow DAI transaction:");
    tx = await lendingPool.borrow(
      daiAddress,
      borrowAmount,
      2, // 1: stable rate, 2: variable rate
      0,
    );
    console.log(tx);

    console.log("");
    let endBalanceETH = await fromSigner.getBalance();
    console.log("ending balance:", ethers.utils.formatEther(endBalanceETH), "ETH");
    let endBalanceDAI = await daiERC20.balanceOf(taskArgs.address);
    console.log("ending balance:", ethers.utils.formatEther(endBalanceDAI), "DAI");
    console.log("Account Health After Deposit");
    await FetchAndLogAaveV1AccountHealth(lendingPool, taskArgs.address);
  })

async function FetchAndLogAaveV2AccountHealth(lendingPool, address) {
  try {
      userAccountData = await lendingPool.getUserAccountData(address);
      console.log("==========================================================")
      console.log("Aave V2 account data for address:", address);
      console.log("", "totalCollateralETH:         ", ethers.utils.formatEther(userAccountData.totalCollateralETH), "ETH");
      console.log("", "totalDebtETH:               ", ethers.utils.formatEther(userAccountData.totalDebtETH), "ETH");
      console.log("", "availableBorrowsETH:        ", ethers.utils.formatEther(userAccountData.availableBorrowsETH), "ETH");
      console.log("", "currentLiquidationThreshold:", ethers.utils.formatEther(userAccountData.currentLiquidationThreshold), "ETH");
      console.log("", "ltv:                        ", userAccountData.ltv.toString()), "%";
      console.log("", "healthFactor:               ", ethers.utils.formatEther(userAccountData.healthFactor));
      console.log("==========================================================")
  } catch (e) {
    console.log("☢️ Error:", e)
  }
  return "";
}

task("aavetrageV2LeverageBorrow", "[Aavetrage] Perform leveraged borrow on Aave v2")
  .addPositionalParam("address", "Address to deposit from")
  .setAction(async (taskArgs, { network, ethers }) => {
    erc20ABI = require("./contracts/external_abi/common/erc20.json");
    wethABI = require("./contracts/external_abi/common/WETH9.json");
    stableDebtTokenABI = require("./contracts/external_abi/aave_v2/StableDebtToken.json");
    v2AddressProviderABI = require("./contracts/external_abi/aave_v2/LendingPoolAddressesProvider.json");
    v2LendingPoolABI = require("./contracts/external_abi/aave_v2/LendingPool.json");
    priceOracleABI = require("./contracts/external_abi/aave_v2/AaveOracle.json");

    v1AaveAddressProviderAddress = "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8";
    v2AaveAddressProviderAddress = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";
    daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    const provider = await ethers.getDefaultProvider();
    const fromSigner = await ethers.provider.getSigner(taskArgs.address);

    const Aavetrage = await ethers.getContractFactory("Aavetrage");
    const aavetrage = await Aavetrage.deploy(v1AaveAddressProviderAddress, v2AaveAddressProviderAddress, uniswapV2RouterAddress);

    const v2AddressProvider = new ethers.Contract(v2AaveAddressProviderAddress, v2AddressProviderABI, provider);
    const v2LendingPoolAddress = await v2AddressProvider.getLendingPool();
    const v2LendingPool = new ethers.Contract(v2LendingPoolAddress, v2LendingPoolABI, fromSigner);
    const priceOracleAddress = await v2AddressProvider.getPriceOracle();
    const priceOracle = new ethers.Contract(priceOracleAddress, priceOracleABI, provider);

    const wethERC20 = new ethers.Contract(wethAddress, wethABI, fromSigner);
    const daiERC20 = new ethers.Contract(daiAddress, erc20ABI, fromSigner);

    const wethToGet = ethers.utils.parseEther("100.0");
    await wethERC20.deposit({value: wethToGet});

    // need to allow aavetrage allowance on all tokens
    await wethERC20.approve(aavetrage.address, ethers.constants.MaxUint256)
    await wethERC20.approve(v2LendingPoolAddress, ethers.constants.MaxUint256)
    await daiERC20.approve(aavetrage.address, ethers.constants.MaxUint256)
    await daiERC20.approve(v2LendingPoolAddress, ethers.constants.MaxUint256)

    // need to allow aavetrage 
    const reserveData = await v2LendingPool.getReserveData(daiAddress);
    // console.log(reserveData);
    const daiPriceWei = await priceOracle.getAssetPrice(daiAddress);

    const stableDebtToken = new ethers.Contract(reserveData["stableDebtTokenAddress"], stableDebtTokenABI, fromSigner);

    const ethToCollateralize = ethers.utils.parseEther("1.0");
    const daiToBorrow = ethers.utils.parseEther("1000.0");
    await stableDebtToken.approveDelegation(aavetrage.address, daiToBorrow);

    // leveraged borrow: weth collateral, dai borrow
    await FetchAndLogAaveV2AccountHealth(v2LendingPool, taskArgs.address);
    console.log("");

    console.log("calling aavetrage.leveragedDepositV2(wethAddress, %s, daiAddress, %s)", ethToCollateralize.toString(), daiToBorrow.toString());
    console.log("depositing %s ETH as collateral", ethers.utils.formatEther(ethToCollateralize));
    console.log("borrowing and re-depositing %s DAI", ethers.utils.formatEther(daiToBorrow));
    console.log("current DAI price: %s ETH", ethers.utils.formatEther(daiPriceWei));
    tx = await aavetrage.AaveV2LeveragedBorrow(
      wethAddress, ethToCollateralize,
      daiAddress, daiToBorrow,
      1
    )

    console.log("");
    await FetchAndLogAaveV2AccountHealth(v2LendingPool, taskArgs.address);
  })

task("aaveV2FlashloanBorrowUserHasNoCollateral", "[Aavetrage] Perform leveraged borrow on Aave v2, where user expects Aavetrage to deposit collateral for them")
  .addPositionalParam("address", "Address to deposit from")
  .setAction(async (taskArgs, { network, ethers }) => {
    erc20ABI = require("./contracts/external_abi/common/erc20.json");
    wethABI = require("./contracts/external_abi/common/WETH9.json");
    stableDebtTokenABI = require("./contracts/external_abi/aave_v2/StableDebtToken.json");
    v2AddressProviderABI = require("./contracts/external_abi/aave_v2/LendingPoolAddressesProvider.json");
    v2LendingPoolABI = require("./contracts/external_abi/aave_v2/LendingPool.json");
    priceOracleABI = require("./contracts/external_abi/aave_v2/AaveOracle.json");
    uniswapV2RouterABI = require("./contracts/external_abi/uniswap/UniswapV2Router02.json");

    uniswapV2RouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    v1AaveAddressProviderAddress = "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8";
    v2AaveAddressProviderAddress = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";
    usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    const provider = await ethers.getDefaultProvider();
    const fromSigner = await ethers.provider.getSigner(taskArgs.address);

    const v2AddressProvider = new ethers.Contract(v2AaveAddressProviderAddress, v2AddressProviderABI, provider);
    const v2LendingPoolAddress = await v2AddressProvider.getLendingPool();
    const v2LendingPool = new ethers.Contract(v2LendingPoolAddress, v2LendingPoolABI, fromSigner);

    const daiERC20 = new ethers.Contract(daiAddress, erc20ABI, fromSigner);
    const daiDecimals = 18;
    const usdcERC20 = new ethers.Contract(usdcAddress, erc20ABI, fromSigner);
    const usdcDecimals = 6;

    const uniswapV2Router = new ethers.Contract(uniswapV2RouterAddress, uniswapV2RouterABI, fromSigner);

    // buy some usdc
    let usdcToBuy = ethers.utils.parseUnits("100000", usdcDecimals)
    let ethToSpend = ethers.utils.parseEther("150.0");
    await uniswapV2Router.swapETHForExactTokens(
      usdcToBuy,
      [wethAddress, usdcAddress],
      taskArgs.address,
      Math.floor(Date.now() / 1000) + 60 * 20,
      {value: ethToSpend})

    const Aavetrage = await ethers.getContractFactory("Aavetrage");
    const aavetrage = await Aavetrage.deploy(v1AaveAddressProviderAddress, v2AaveAddressProviderAddress, uniswapV2RouterAddress);

    await usdcERC20.approve(aavetrage.address, ethers.constants.MaxUint256)

    // need to make an approval for the borrow asset (on stableDebtToken) in order to incur flashloan
    const reserveData = await v2LendingPool.getReserveData(daiAddress);
    const stableDebtToken = new ethers.Contract(reserveData["stableDebtTokenAddress"], stableDebtTokenABI, fromSigner);
    await stableDebtToken.approveDelegation(aavetrage.address, ethers.constants.MaxUint256);

    /*
     * call aavetrage
     */

    console.log("Health Factor before call");
    await FetchAndLogAaveV2AccountHealth(v2LendingPool, taskArgs.address);

    let daiToBorrow = ethers.utils.parseUnits("300000", daiDecimals)
    console.log("User providing 100,000 USDC as collateral, borrowing 300,000 DAI with flashloan")
    let tx = await aavetrage.AaveV2LeveragedBorrow(
      usdcAddress, usdcToBuy, // collateralAsset, collateralAmount
      daiAddress, daiToBorrow, // borrowAsset, collateralAmount
      1 // flashloan mode
    )

    console.log(tx);

    console.log("Health Factor after call");
    await FetchAndLogAaveV2AccountHealth(v2LendingPool, taskArgs.address);
  })

task("aaveV2FlashloanBorrowUserHasCollateral", "[Aavetrage] Perform leveraged borrow on Aave v2, where user already has deposited collateral")
  .addPositionalParam("address", "Address to deposit from")
  .setAction(async (taskArgs, { network, ethers }) => {
    erc20ABI = require("./contracts/external_abi/common/erc20.json");
    wethABI = require("./contracts/external_abi/common/WETH9.json");
    stableDebtTokenABI = require("./contracts/external_abi/aave_v2/StableDebtToken.json");
    v2AddressProviderABI = require("./contracts/external_abi/aave_v2/LendingPoolAddressesProvider.json");
    v2LendingPoolABI = require("./contracts/external_abi/aave_v2/LendingPool.json");
    priceOracleABI = require("./contracts/external_abi/aave_v2/AaveOracle.json");
    uniswapV2RouterABI = require("./contracts/external_abi/uniswap/UniswapV2Router02.json");

    uniswapV2RouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    v1AaveAddressProviderAddress = "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8";
    v2AaveAddressProviderAddress = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";
    usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    const provider = await ethers.getDefaultProvider();
    const fromSigner = await ethers.provider.getSigner(taskArgs.address);

    const v2AddressProvider = new ethers.Contract(v2AaveAddressProviderAddress, v2AddressProviderABI, provider);
    const v2LendingPoolAddress = await v2AddressProvider.getLendingPool();
    const v2LendingPool = new ethers.Contract(v2LendingPoolAddress, v2LendingPoolABI, fromSigner);

    const daiERC20 = new ethers.Contract(daiAddress, erc20ABI, fromSigner);
    const daiDecimals = 18;
    const usdcERC20 = new ethers.Contract(usdcAddress, erc20ABI, fromSigner);
    const usdcDecimals = 6;

    const uniswapV2Router = new ethers.Contract(uniswapV2RouterAddress, uniswapV2RouterABI, fromSigner);

    // buy some usdc
    let usdcToBuy = ethers.utils.parseUnits("100000", usdcDecimals)
    let ethToSpend = ethers.utils.parseEther("150.0");
    await uniswapV2Router.swapETHForExactTokens(
      usdcToBuy,
      [wethAddress, usdcAddress],
      taskArgs.address,
      Math.floor(Date.now() / 1000) + 60 * 20,
      {value: ethToSpend})

    const Aavetrage = await ethers.getContractFactory("Aavetrage");
    const aavetrage = await Aavetrage.deploy(v1AaveAddressProviderAddress, v2AaveAddressProviderAddress, uniswapV2RouterAddress);

    // need to make an approval for the borrow asset (on stableDebtToken) in order to incur flashloan
    const reserveData = await v2LendingPool.getReserveData(daiAddress);
    const stableDebtToken = new ethers.Contract(reserveData["stableDebtTokenAddress"], stableDebtTokenABI, fromSigner);
    await stableDebtToken.approveDelegation(aavetrage.address, ethers.constants.MaxUint256);

    /*
     * User deposits collateral before calling Aavetrage
     */
    // lending pool pulls USDC, so need to approve
    await usdcERC20.approve(v2LendingPoolAddress, ethers.constants.MaxUint256)
    await v2LendingPool.deposit(usdcAddress, usdcToBuy, taskArgs.address, 0)

    /*
     * call Aavetrage, with 0 collateral
     */

    console.log("Health Factor before call");
    await FetchAndLogAaveV2AccountHealth(v2LendingPool, taskArgs.address);

    let daiToBorrow = ethers.utils.parseUnits("300000", daiDecimals)
    console.log("User providing 100,000 USDC as collateral, borrowing 300,000 DAI with flashloan")
    let tx = await aavetrage.AaveV2LeveragedBorrow(
      usdcAddress, 0, // collateralAsset, collateralAmount
      daiAddress, daiToBorrow, // borrowAsset, collateralAmount
      1 // flashloan mode
    )

    console.log(tx);

    console.log("Health Factor after call");
    await FetchAndLogAaveV2AccountHealth(v2LendingPool, taskArgs.address);
  })