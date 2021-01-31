const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const DEBUG = false;

function debug(text) {
  if (DEBUG) {
    console.log(text);
  }
}


describe("Aavetrage", function () {
    let aavetrage;
    let aaveV1AddressProvider;
    let aaveV1LendingPool;
    let daiERC20;

    let testSigner;
    let testProvider;

    // mainnet addresses for testing in forked environment
    let aaveV1AddressProviderAddress = "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8";
    let aaveV2AddressProviderAddress = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";
    let daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    let ethPlaceholderAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

    let addressProviderABI = require("../contracts/external_abi/aave_v1/LendingPoolAddressesProvider.json");
    let lendingPoolABI = require("../contracts/external_abi/aave_v1/LendingPool.json");
    let erc20ABI = require("../contracts/external_abi/common/erc20.json");

    describe("Aavetrage", function () {
        it("Should deploy Aavetrage", async function () {
            const Aavetrage = await ethers.getContractFactory("Aavetrage");
            aavetrage = await Aavetrage.deploy(aaveV1AddressProviderAddress, aaveV2AddressProviderAddress);

            const [owner] = await ethers.getSigners()
            testSigner = owner;
            testProvider = await ethers.getDefaultProvider();

            aaveV1AddressProvider = new ethers.Contract(aaveV1AddressProviderAddress, addressProviderABI, testProvider);
            aaveV1LendingPool = new ethers.Contract(await aaveV1AddressProvider.getLendingPool(), lendingPoolABI, testSigner);
            daiERC20 = new ethers.Contract(daiAddress, erc20ABI, testSigner);
        });

        describe("", function () {
            it("Should blah", async function () {
            });
        });

        describe("Test borrow on V1 and deposit to V2", function () {
            it("Should properly deposit ETH and borrow DAI", async function () {
                let startBalanceETH = await testSigner.getBalance();
                let startBalanceDAI = await daiERC20.balanceOf(testSigner.address);
                expect(startBalanceDAI).to.equal(0)

                // Deposit collateral to V1
                let depositAmount = ethers.utils.parseEther("100.0");
                let tx = await aaveV1LendingPool.deposit(
                    ethPlaceholderAddress,
                    depositAmount,
                    0,
                    {value: depositAmount}
                );

                // take out a DAI borrow on V1
                let borrowAmount = ethers.utils.parseEther("65000.0"); // should be about 75% ltv
                tx = await aaveV1LendingPool.borrow(
                    daiAddress,
                    borrowAmount,
                    2, // 1: stable rate, 2: variable rate
                    0,
                );

                let endBalanceETH = await testSigner.getBalance();
                expect(endBalanceETH).to.lt(startBalanceETH)

                let endBalanceDAI = await daiERC20.balanceOf(testSigner.address);
                expect(endBalanceDAI).to.equal(borrowAmount);
            });
        });
    });
});
