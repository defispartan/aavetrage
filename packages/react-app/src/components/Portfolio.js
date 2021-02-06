import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "../App.css";
import { Row, Col, Menu } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "../hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge } from "./";
import { Transactor } from "../helpers";
import { formatEther, parseEther } from "@ethersproject/units";
//import Hints from "./Hints";
import { Hints, ExampleUI } from "../views"
import PortfolioImg from '../assets/img/portfolio.png'
import AAVEText from '../assets/img/aavetext.png'
import { Button, Card, CardBody, CardHeader, Container, Progress, Table, Spinner } from 'reactstrap';
import { getPortfolio } from './Data/GetPortfolio.js'
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    📡 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/
import { INFURA_ID, DAI_ADDRESS, DAI_ABI } from "../constants";

// 😬 Sorry for all the console logging 🤡
const DEBUG = false

// 🔭 block explorer URL
const blockExplorer = "https://etherscan.io/" // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
//const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)
if (DEBUG) console.log("window.location.hostname", window.location.hostname)
// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://" + window.location.hostname + ":8545"; // for xdai: https://dai.poa.network
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

const round = (value, decimals) => {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Portfolio(props) {
    const [injectedProvider, setInjectedProvider] = useState(null);

    const [homeHover, setHomeHover] = useState(false)
    const [portfolioHover, setPortfolioHover] = useState(false)
    const [aboutHover, setAboutHover] = useState(false)
    const [v1Action, setV1Action] = useState(null)
    const [v2Action, setV2Action] = useState(null)
    const [portfolioLoaded, setPortfolioLoaded] = useState(false)
    const [portfolioData, setPortfolioData] = useState(null)
    const [aavetrageBorrowSelect, setaavetrageBorrowSelect] = useState(null)
    const [aavetrageDepositSelect, setaavetrageDepositSelect] = useState(null)


    /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
    const price = useExchangePrice(mainnetProvider); //1 for xdai

    /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
    const gasPrice = useGasPrice("fast"); //1000000000 for xdai

    // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

    // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
    //const userProvider = useUserProvider(injectedProvider, localProvider);
    const userProvider = useUserProvider(injectedProvider, null);
    const address = useUserAddress(userProvider);

    // The transactor wraps transactions and provides notificiations
    const tx = Transactor(userProvider, gasPrice)

    // Faucet Tx can be used to send funds from the faucet
    const faucetTx = Transactor(localProvider, gasPrice)

    // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
    const yourLocalBalance = useBalance(localProvider, address);
    if (DEBUG) console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...")

    // just plug in different 🛰 providers to get your balance on different chains:
    const yourMainnetBalance = useBalance(mainnetProvider, address);
    if (DEBUG) console.log("💵 yourMainnetBalance", yourMainnetBalance ? formatEther(yourMainnetBalance) : "...")

    // Load in your local 📝 contract and read a value from it:
    const readContracts = useContractLoader(localProvider)
    if (DEBUG) console.log("📝 readContracts", readContracts)

    // If you want to make 🔐 write transactions to your contracts, use the userProvider:
    const writeContracts = useContractLoader(userProvider)
    if (DEBUG) console.log("🔐 writeContracts", writeContracts)

    // EXTERNAL CONTRACT EXAMPLE:
    //
    // If you want to bring in the mainnet DAI contract it would look like:
    //const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)
    //console.log("🥇DAI contract on mainnet:",mainnetDAIContract)
    //
    // Then read your DAI balance like:
    //const myMainnetBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
    //

    // keep track of a variable from the contract in the local React state:
    const purpose = useContractReader(readContracts, "YourContract", "purpose")
    if (DEBUG) console.log("🤗 purpose:", purpose)

    //📟 Listen for broadcast events
    const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);
    if (DEBUG) console.log("📟 SetPurpose events:", setPurposeEvents)

    /*
    const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
    console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
    */

    const loadWeb3Modal = useCallback(async () => {
        const provider = await web3Modal.connect();
        setInjectedProvider(new Web3Provider(provider));
    }, [setInjectedProvider]);


    const fetchPortfolioData = async () => {
        let port = await getPortfolio(injectedProvider.provider.selectedAddress, price);
        console.log(port)
        setPortfolioData(port)
        setPortfolioLoaded(true)
    }
    useEffect(() => {
        if (web3Modal.cachedProvider) {
            loadWeb3Modal();
        }
    }, [loadWeb3Modal]);


    useEffect(() => {
        if (injectedProvider !== null && price > 0) {
            fetchPortfolioData()
        }
    }, [injectedProvider, price])



    const displayText = (icon) => {

        if (icon === 'home' && homeHover) {
            return (<div className="displayiconname"><p className="iconname">Home</p></div>)
        }
        else if (icon === 'portfolio' && portfolioHover) {
            return (<div className="displayiconname"><p className="iconname">Portfolio</p></div>)
        }
        else if (icon === 'about' && aboutHover) {
            return (<div className="displayiconname"><p className="iconname">About</p></div>)
        }
        else {
            return (<></>)
        }
    }

    const displayV1ActionPanel = () => {
        if (v1Action !== null) {
            return (
                <Card className="shadow marketcard" style={{ backgroundColor: '#333', borderColor: 'white' }}>
                    <CardHeader className="border-0">
                        <h3 className="actionHeader">{v1Action}</h3>
                    </CardHeader>
                    <CardBody>
                        <p style={{ color: "red" }}>Coming Soon</p>
                    </CardBody>
                </Card>
            )
        }
        else {

            return <></>
        }
    }

    const displayV2ActionPanel = () => {
        if (v2Action !== null) {
            if (v2Action !== "AAVEtrage") {
                return (
                    <Card className="shadow marketcard" style={{ backgroundColor: '#333', borderColor: 'white' }}>
                        <CardHeader className="border-0">
                            <h3 className="actionHeader">{v2Action}</h3>

                        </CardHeader>
                        <CardBody>
                            <p style={{ color: "red" }}>Coming Soon</p>
                        </CardBody>
                    </Card>
                )
            }
            else {
                return (displayV2AAVEtrage())
            }
        }
        else {

            return <></>
        }
    }

    const displayBorrowRow = () => {
        return (
            <div className="rateRow">
                <div className="rateRowEntry">

                    <h5 className="actionHeader">USDC</h5>
                    <Button outline className="stableButton" onClick={() => { setaavetrageBorrowSelect('usdc variable') }}>%</Button>
                    <Button outline className="variableButton" onClick={() => { setaavetrageBorrowSelect('usdc stable') }}>%</Button>
                </div>
                <div className="rateRowEntry">

                    <h5 className="actionHeader">USDT</h5>
                    <Button outline className="stableButton" onClick={() => { setaavetrageBorrowSelect('usdt variable') }}>%</Button>
                    <Button outline className="variableButton" onClick={() => { setaavetrageBorrowSelect('usdt stable') }}>%</Button>
                </div>
                <div className="rateRowEntry">

                    <h5 className="actionHeader">DAI</h5>
                    <Button outline className="stableButton" onClick={() => { setaavetrageBorrowSelect('dai variable') }}>%</Button>
                    <Button outline className="variableButton" onClick={() => { setaavetrageBorrowSelect('dai stable') }}>%</Button>
                </div>
                <div className="rateRowEntry">

                    <h5 className="actionHeader">TUSD</h5>
                    <Button outline className="stableButton" onClick={() => { setaavetrageBorrowSelect('tusd variable') }}>%</Button>
                    <Button outline className="variableButton" onClick={() => { setaavetrageBorrowSelect('tusd stable') }}>%</Button>
                </div>
                <div className="rateRowEntry">

                    <h5 className="actionHeader">SUSD</h5>
                    <Button outline className="stableButton" onClick={() => { setaavetrageBorrowSelect('susd variable') }}>%</Button>
                    <Button outline className="variableButton" onClick={() => { setaavetrageBorrowSelect('susd stable') }}>%</Button>
                </div>
                <div className="rateRowEntry">

                    <h5 className="actionHeader">BUSD</h5>
                    <Button outline className="stableButton" onClick={() => { setaavetrageBorrowSelect('busd variable') }}>%</Button>
                    <Button outline className="variableButton" onClick={() => { setaavetrageBorrowSelect('busd stable') }}>%</Button>
                </div>
                <div className="rateRowEntry">

                    <h5 className="actionHeader">GUSD</h5>
                    <Button outline className="stableButton" onClick={() => { setaavetrageBorrowSelect('gusd variable') }}>%</Button>
                    <Button outline className="variableButton" onClick={() => { setaavetrageBorrowSelect('gusd stable') }}>%</Button>
                </div>

            </div>
        )
    }

    const displayDepositRow = () => {
        if (aavetrageBorrowSelect !== null) {
            return (
                <>
                    <h4 className="actionHeader" style={{ paddingTop: "50px" }}>Select Deposit</h4>
                    <div style={{ display: "inline-block" }}>
                        <p style={{ display: "inline-block", color: "white", paddingRight: "20px" }}>Stable Rate<div className="box pink"></div>
                        </p>
                        <p style={{ display: "inline-block", color: "white" }}>

                            Variable Rate<div className="box blue"></div>
                        </p>
                    </div>
                    <div className="rateRow">
                        <div className="rateRowEntry">

                            <h5 className="actionHeader">USDC</h5>
                            <Button outline className="variableButton" onClick={() => { setaavetrageDepositSelect('usdc variable') }}>%</Button>

                        </div>
                        <div className="rateRowEntry">

                            <h5 className="actionHeader">USDT</h5>
                            <Button outline className="variableButton" onClick={() => { setaavetrageDepositSelect('usdt variable') }}>%</Button>

                        </div>
                        <div className="rateRowEntry">

                            <h5 className="actionHeader">DAI</h5>
                            <Button outline className="variableButton" onClick={() => { setaavetrageDepositSelect('dai variable') }}>%</Button>

                        </div>
                        <div className="rateRowEntry">

                            <h5 className="actionHeader">TUSD</h5>
                            <Button outline className="variableButton" onClick={() => { setaavetrageDepositSelect('tusd variable') }}>%</Button>

                        </div>
                        <div className="rateRowEntry">

                            <h5 className="actionHeader">SUSD</h5>
                            <Button outline className="variableButton" onClick={() => { setaavetrageDepositSelect('susd variable') }}>%</Button>

                        </div>
                        <div className="rateRowEntry">

                            <h5 className="actionHeader">BUSD</h5>
                            <Button outline className="variableButton" onClick={() => { setaavetrageDepositSelect('busd variable') }}>%</Button>

                        </div>
                        <div className="rateRowEntry">

                            <h5 className="actionHeader">GUSD</h5>
                            <Button outline className="variableButton" onClick={() => { setaavetrageDepositSelect('gusd variable') }}>%</Button>

                        </div>

                    </div></>)
        }
        else {
            return (<></>)
        }
    }

    const displayAAVEtrageSelect = () => {
        if (aavetrageBorrowSelect !== null && aavetrageDepositSelect !== null) {
            return (
                <>
                    <h4 className="actionHeader" style={{ paddingTop: "50px" }}>Select AAVEtrage Amounts</h4>
                    <div style={{ width: "100%" }}>
                        <div style={{ width: "50%", float: "left" }}><p>Collateral and Debt Graph</p></div>
                        <div style={{ width: "50%", float: "right" }}><p>Borrow Amount Slider</p><p>Health Factor Change</p></div>
                        <div style={{ width: "33%", margin: "0 auto", float: "center" }}><Button color="success">Execute AAVEtrage</Button></div>
                    </div>
                </>)
        }
        else {
            return <></>
        }
    }

    const displayV2AAVEtrage = () => {
        return (
            <Card className="shadow marketcard" style={{ backgroundColor: '#333', borderColor: 'white' }}>
                <CardHeader className="border-0">
                    <h3 className="actionHeader">{v2Action}</h3>
                </CardHeader>
                <CardBody>
                    <h4 className="actionHeader">Select Borrow</h4>
                    <div style={{ display: "inline-block" }}>
                        <div style={{ display: "inline-block", color: "white", paddingRight: "30px" }}>Stable Rate<div className="box pink"></div>
                        </div>
                        <div style={{ display: "inline-block", color: "white" }}>

                            Variable Rate<div className="box blue"></div>
                        </div>
                    </div>
                    {displayBorrowRow()}
                    {displayDepositRow()}
                    {displayAAVEtrageSelect()}

                </CardBody>
            </Card >
        )
    }

    const setAction = (market, action) => {
        if (market === 'v1') {
            setV1Action(action)
        }
        else if (market === 'v2') {
            setV2Action(action)
        }
    }

    const displayWalletConnect = () => {
        if (injectedProvider !== null) {
            return (
                <div style={{ position: "absolute", textAlign: "right", right: 0, top: 0, padding: 10 }
                }>
                    <Account
                        minimized={false}
                        address={address}
                        localProvider={localProvider}
                        userProvider={userProvider}
                        mainnetProvider={mainnetProvider}
                        price={price}
                        web3Modal={web3Modal}
                        loadWeb3Modal={loadWeb3Modal}
                        logoutOfWeb3Modal={logoutOfWeb3Modal}
                        blockExplorer={blockExplorer}
                    />
                    <GasGauge gasPrice={gasPrice} />
                </div>)
        }
        else {
            return (
                <div className="walletConnect"
                >
                    <Account
                        minimized={true}
                        address={address}
                        localProvider={localProvider}
                        userProvider={userProvider}
                        mainnetProvider={mainnetProvider}
                        price={price}
                        web3Modal={web3Modal}
                        loadWeb3Modal={loadWeb3Modal}
                        logoutOfWeb3Modal={logoutOfWeb3Modal}
                        blockExplorer={blockExplorer}
                    />

                </div>)
        }
    }

    const calcTotalBalance = () => {
        let total = (portfolioData[0].totalCollateralUSD - portfolioData[0].totalBorrowsUSD) + (portfolioData[1].totalCollateralUSD - portfolioData[1].totalBorrowsUSD)
        return ("$" + numberWithCommas(round(total, 2)))
    }

    const calcBorrowPercent = (market) => {
        let percent = "0"
        if (market === "v1") {
            let avail = parseFloat(portfolioData[0].availableBorrowsETH)
            let used = parseFloat(portfolioData[0].totalBorrowsETH)
            if (avail + used !== 0) {
                percent = round((used / (avail + used) * 100), 0)
            }
        }
        else if (market === "v2") {
            let avail = parseFloat(portfolioData[1].availableBorrowsETH)
            let used = parseFloat(portfolioData[1].totalBorrowsETH)
            if (avail + used !== 0) {
                percent = round((used / (avail + used) * 100), 0)
            }
        }
        return percent
    }

    const splitReserves = (reserves) => {
        let deposits = []
        let borrows = []
        reserves.forEach(entry => {
            if (entry.principalATokenBalance > 0) {
                deposits.push(entry)
            }
            else {
                borrows.push(entry)
            }
        })
        return [deposits, borrows]
    }

    const displayV2Table = () => {
        let split = splitReserves(portfolioData[1].reservesData)
        console.log("v2 PLIT")
        console.log(split)
        let deposits = split[0]
        let borrows = split[1]
        let numRow = Math.max(deposits.length, borrows.length)
        let rowCount = 0
        let rows = []
        while (rowCount < numRow) {
            if (rowCount < deposits.length && rowCount < borrows.length) {
                rows.push(['1000 USDC', '14% Variable', '$100000', '590000 DAI', '7.2% stable', '$500000'])
            }
            else if (rowCount < deposits.length && rowCount >= borrows.length) {
                rows.push(['1000 USDC', '14% Variable', '$100000', '-', '-', '-'])
            }
            else if (rowCount >= deposits.length && rowCount < borrows.length) {
                rows.push(['-', '-', '-', '590000 DAI', '7.2% stable', '$500000'])
            }

            rowCount++
        }
        return (
            <tbody>

                {    rows.map(row => {
                    return (<tr>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td>{row[5]}</td>
                    </tr>)
                })}
            </tbody>
        )
    }

    const displayV2Portfolio = () => {
        return (
            <div className="ratematrix">

                <Card className="shadow marketcard">
                    <CardHeader className="border-0" style={{ backgroundColor: '#333', borderColor: '#333' }}>
                        <h3 className="actionHeader">AAVE V2 Market</h3>
                    </CardHeader>
                    <Table className="align-items-center table-flush" style={{ marginBottom: "0px", backgroundColor: '#333', borderColor: '#333' }} bordered responsive>
                        <thead>
                            <tr>
                                <th colSpan="3">Deposits</th>
                                <th colSpan="3">Borrows</th>
                            </tr>
                            <tr>
                                <th>Asset</th>
                                <th>Interest Rate</th>
                                <th>USD Value</th>
                                <th>Asset</th>
                                <th>Interest Rate</th>
                                <th>USD Value</th>
                            </tr>
                        </thead>

                        {displayV2Table()}

                    </Table>
                </Card>
                <div className="actionbuttonrow">
                    <Button className="actionbutton" onClick={() => { setAction('v2', 'Deposit') }}>Deposit</Button>
                    <Button className="actionbutton" onClick={() => { setAction('v2', 'Withdraw') }}>Withdraw</Button>
                    <Button className="actionbutton" onClick={() => { setAction('v2', 'Collateral Swap') }}> Collateral Swap</Button>
                    <Button className="actionbutton" onClick={() => { setAction('v2', 'AAVEtrage') }} style={{ backgroundColor: '#B6509E', marginTop: '0px' }}>AAVEtrage</Button>
                    <Button className="actionbutton" onClick={() => { setAction('v2', 'Borrow') }} >Borrow</Button>
                    <Button className="actionbutton" onClick={() => { setAction('v2', 'Payback') }}>Payback</Button>
                    <Button className="actionbutton" onClick={() => { setAction('v2', 'Debt Swap') }}>Debt Swap</Button>
                </div>
                {displayV2ActionPanel()}
            </div>
        )
    }
    const displayV1Table = () => {
        let split = splitReserves(portfolioData[0].reservesData)
        let deposits = split[0]
        let borrows = split[1]
        let numRow = Math.max(deposits.length, borrows.length)
        console.log(numRow)
        let rowCount = 0
        let rows = []
        while (rowCount < numRow) {
            if (rowCount < deposits.length && rowCount < borrows.length) {
                rows.push([round(deposits[rowCount].currentUnderlyingBalance, 4) + " " + deposits[rowCount].reserve.symbol, round((deposits[rowCount].reserve.liquidityRate * 100), 2) + "% " + deposits[rowCount].borrowRateMode, "$" + numberWithCommas(round(deposits[rowCount].currentUnderlyingBalanceUSD, 2)), round(borrows[rowCount].currentBorrows, 2) + " " + borrows[rowCount].reserve.symbol, round(borrows[rowCount].borrowRate * 100, 2) + "% " + borrows[rowCount].borrowRateMode, "$" + numberWithCommas(round(borrows[rowCount].currentBorrowsUSD, 2))])
            }
            else if (rowCount < deposits.length && rowCount >= borrows.length) {
                rows.push([round(deposits[rowCount].currentUnderlyingBalance, 4) + " " + deposits[rowCount].reserve.symbol, round((deposits[rowCount].reserve.liquidityRate * 100), 2) + "% " + deposits[rowCount].borrowRateMode, "$" + numberWithCommas(round(deposits[rowCount].currentUnderlyingBalanceUSD, 2)), '', '', ''])
            }
            else if (rowCount >= deposits.length && rowCount < borrows.length) {
                rows.push(['', '', '', round(borrows[rowCount].currentBorrows, 4) + " " + borrows[rowCount].reserve.symbol, round(borrows[rowCount].borrowRate * 100, 2) + "% " + borrows[rowCount].borrowRateMode, "$" + numberWithCommas(round(borrows[rowCount].currentBorrowsUSD, 2))])
            }

            rowCount++
        }
        return (
            <tbody>

                {    rows.map(row => {
                    return (
                        <tr>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                            <td>{row[3]}</td>
                            <td>{row[4]}</td>
                            <td>{row[5]}</td>
                        </tr>)
                })}
            </tbody>
        )
    }
    const displayV1Portfolio = () => {
        return (<div className="ratematrix">

            <Card className="shadow marketcard">
                <CardHeader className="border-0" style={{ backgroundColor: '#333', borderColor: '#333' }}>
                    <h3 className="actionHeader">AAVE V1 Market</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" style={{ marginBottom: "0px", backgroundColor: '#333', borderColor: '#333' }} bordered responsive>
                    <thead>
                        <tr>
                            <th colSpan="3">Deposits</th>
                            <th colSpan="3">Borrows</th>
                        </tr>
                        <tr>
                            <th>Asset</th>
                            <th>Interest Rate</th>
                            <th>USD Value</th>
                            <th>Asset</th>
                            <th>Interest Rate</th>
                            <th>USD Value</th>
                        </tr>
                    </thead>

                    {displayV1Table()}

                </Table>
            </Card>
            <div className="actionbuttonrow">
                <Button className="actionbutton" onClick={() => { setAction('v1', 'Deposit') }}>Deposit</Button>
                <Button className="actionbutton" onClick={() => { setAction('v1', 'Withdraw') }}>Withdraw</Button>
                <Button className="actionbutton" onClick={() => { setAction('v1', 'Collateral Swap') }}> Collateral Swap</Button>
                <Button className="actionbutton" onClick={() => { setAction('v1', 'AAVEtrage') }} style={{ backgroundColor: '#B6509E', marginTop: '0px' }}>AAVEtrage</Button>
                <Button className="actionbutton" onClick={() => { setAction('v1', 'Borrow') }} >Borrow</Button>
                <Button className="actionbutton" onClick={() => { setAction('v1', 'Payback') }}>Payback</Button>
                <Button className="actionbutton" onClick={() => { setAction('v1', 'Debt Swap') }}>Debt Swap</Button>
            </div>
            {displayV1ActionPanel()}
        </div>)
    }

    const displayPortfolio = () => {
        if (injectedProvider !== null) {
            if (portfolioLoaded === false) {
                return (
                    <div style={{ width: '100%', margin: "0 auto", textAlign: "center" }}>

                        <Spinner style={{ width: "3em", height: "3em" }} color="primary" />
                        <p style={{ color: 'white', paddingTop: '20px' }}>Fetching AAVE Portfolio</p>
                    </div>)
            }
            else {
                return (
                    <div className="asset">

                        <h3 className="portfolioheader">AAVE Portfolio Balance</h3>
                        <h3 className="portfolioheader" style={{ fontFamily: 'Open Sans', paddingBottom: "50px" }}>{calcTotalBalance()}</h3>

                        <div className="marketoverview">

                            <div className="marketheaderblock" style={{ paddingBottom: "75px" }}>
                                <h4 style={{ color: 'white' }}>AAVE V1 Market</h4>
                                <div className="marketheaderblock">
                                    <h5 style={{ color: "white" }}>Deposits</h5>
                                    <h5 style={{ fontFamily: 'Open Sans', color: "white" }}>{"$" + numberWithCommas(round(portfolioData[0].totalCollateralUSD, 2))}</h5>
                                </div>
                                <div className="marketheaderblock">
                                    <h5 style={{ color: "white" }}>Borrows</h5>
                                    <h5 style={{ fontFamily: 'Open Sans', color: "white" }}>{"$" + numberWithCommas(round(portfolioData[0].totalBorrowsUSD, 2))}</h5>
                                </div>
                                <div className="borrowpower">
                                    <h5 style={{ color: 'white' }}>Borrowing Power Used - {calcBorrowPercent("v1") + "%"}</h5>
                                    <Progress value={calcBorrowPercent("v1")} />
                                </div>

                            </div>
                            <div className="marketheaderblock" style={{ paddingBottom: "75px" }}>
                                <h4 style={{ color: 'white' }}>AAVE V2 Market</h4>
                                <div className="marketheaderblock">
                                    <h5 style={{ color: "white" }}>Deposits</h5>
                                    <h5 style={{ fontFamily: 'Open Sans', color: "white" }}>{"$" + numberWithCommas(round(portfolioData[1].totalCollateralUSD, 2))}</h5>
                                </div>
                                <div className="marketheaderblock">
                                    <h5 style={{ color: "white" }}>Borrows</h5>
                                    <h5 style={{ fontFamily: 'Open Sans', color: "white" }}>{"$" + numberWithCommas(round(portfolioData[1].totalBorrowsUSD, 2))}</h5>
                                </div>
                                <div className="borrowpower">
                                    <h5 style={{ color: 'white' }}>Borrowing Power Used - {calcBorrowPercent("v2") + "%"}</h5>
                                    <Progress value={calcBorrowPercent("v2")} />
                                </div>

                            </div>
                        </div>




                        {displayV2Portfolio()}
                        {displayV1Portfolio()}



                    </div>)
            }
        }
        else {
            return (<></>)
        }
    }

    const displayFaucet = () => {
        return (<></>)
        if (injectedProvider !== null) {
            return (<div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
                <Row align="middle" gutter={[4, 4]}>
                    <Col span={8}>
                        <Ramp price={price} address={address} />
                    </Col>

                    <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
                        <GasGauge gasPrice={gasPrice} />
                    </Col>
                    <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
                        <Button
                            onClick={() => {
                                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
                            }}
                            size="large"
                            shape="round"
                        >
                            <span style={{ marginRight: 8 }} role="img" aria-label="support">
                                💬
   </span>
   Support
 </Button>
                    </Col>
                </Row>

                <Row align="middle" gutter={[4, 4]}>
                    <Col span={24}>
                        {

                            /*  if the local provider has a signer, let's show the faucet:  */
                            localProvider && localProvider.connection && localProvider.connection.url && localProvider.connection.url.indexOf(window.location.hostname) >= 0 && !process.env.REACT_APP_PROVIDER && price > 1 ? (
                                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
                            ) : (
                                    ""
                                )
                        }
                    </Col>
                </Row>
            </div>)
        }
        else {
            return (<></>)
        }
    }

    return (
        <div className="App">
            <header className="App-header">

                <div className="select">
                    <Link to={'/index'} >

                        <div onMouseEnter={() => setHomeHover(true)} onMouseLeave={() => setHomeHover(false)} className="icon">

                            <i className="fa fa-home circle-icon"></i>
                            {displayText("home")}

                        </div >
                    </Link>
                    <Link to={'/portfolio'} >
                        <div onMouseEnter={() => setPortfolioHover(true)} onMouseLeave={() => setPortfolioHover(false)} className="icon">

                            <i className="fa fa-folder circle-icon"></i>
                            {displayText("portfolio")}

                        </div>
                    </Link>
                    <Link to={'/about'} >
                        <div onMouseEnter={() => setAboutHover(true)} onMouseLeave={() => setAboutHover(false)} className="icon">

                            <i className="fa fa-info circle-icon"></i>
                            {displayText("about")}

                        </div>
                    </Link>
                </div>



                <div className="header">

                    <img src={PortfolioImg} className="portfolioimage" alt='portfolio'></img>
                </div>


                {displayWalletConnect()}

                {displayPortfolio()}

                {displayFaucet()}

            </header>
        </div>
    );
}


/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions: {
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                infuraId: INFURA_ID,
            },
        },
    },
});

const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    setTimeout(() => {
        window.location.reload();
    }, 1);
};

export default Portfolio;
