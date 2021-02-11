import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "../App.css";
import AboutImg from '../assets/img/about.png'
import KawaiImage from '../assets/img/flashloankawai.png'


function About(props) {

    const [homeHover, setHomeHover] = useState(false)
    const [portfolioHover, setPortfolioHover] = useState(false)
    const [aboutHover, setAboutHover] = useState(false)

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

                    <img src={AboutImg} className="aboutimage" alt='about'></img>
                </div>


                <div className="asset">
                    <div className="aboutsection">
                        <h3 className="aboutheader">What is AAVE?</h3>
                        <p>AAVE is decentralized and non-custodial money market protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion. For borrowers, they are given the option to borrow at either variable or fixed rates. Depositors receive an aToken version of the asset they have deposited into AAVE, which accrues interest each second. Each asset exists as its own pool. The protocol has been audited and secured. The protocol is open source, which allows anyone to interact with the user interface client, API or directly with the smart contracts on the Ethereum network. Being open source means that users are able to build any third-party service or application to interact with the protocol and enrich their product (like this one). The decentralized nature of AAVE also means that users can propose changes to the protocol in the form of governance. </p>
                    </div>
                    <div className="aboutsection">
                        <h3 className="aboutheader">What is AAVEtrage?</h3>
                        <p>AAVEtrage is dashboard focused on interest rate arbitrage. AAVE offers stable and variable rate borrowing for a variety of stablecoins (and in the future a variety of markets). Each stablecoin has distinct use cases, creating different streams of lending and borrowing demand, and interest rate spreads. The goal of AAVEtrage is to enable AAVE users to utilize their borrowing power for generating additional yield. With AAVE V2, debt-incurring flashloans can be used to enter an arbitrage position with up to 5x leverage on the initial collateral.</p>
                    </div>
                    <div className="aboutsection">
                        <h3 className="aboutheader">What is the flashloan boost?</h3>

                        <p>A flashloan is a financial instrument which is unique to DeFi. In Ethereum, all transactions are atomic, which means that every transaction ends in one of two outcomes: success or failure. Flashloans take advantage of this atmocity, and allow users to borrow as many funds from a liquidity pool as possible in an uncollateralized manner, provided that the user returns these funds to the pool by the end of the transaction. If the payback condition is not met, the transaction will fail, and it will be as if the loan never took place. Flashloans can be used for a variety of use cases, with arbitrage being the most common. AAVEtrage utilizes flashloans to simplify the process of gaining leverage. It is approximately 6 times more efficient to use a debt-incurring flashloan to enter a leveraged position as opposed to borrowing and depositing 5 times in succession. </p>
                        <p>The maximum 5x leverage can be acheived by using exclusively USDC as the collateral, because USDC has an 80% maximum loan to value ratio. If you start with 100 USDC, you could borrow a maximum of 80 USDC in a single unleveraged transaction. With a flashloan you can borrow 400 USDC, deposit it as collateral (for a total of 500 USDC), and incur the 400 USDC as debt. After this transaction you will have 5x the collateral exposure that you started with.</p>
                        {/* <div className="compRow">

                            <div className="compElement"><img src={KawaiImage} alt="flashloan boost kawai" className="comp"></img></div>


                            <div className="compElement">           <img src={KawaiImage} alt="flashloan boost kawai" className="comp"></img></div>
                        </div> */}
                        <div className="kawaiHead">

                            <img src={KawaiImage} alt="flashloan boost kawai" className="kawaiAbout"></img>
                        </div>
                    </div>
                    <div className="aboutsection">
                        <h3 className="aboutheader">Risks</h3>
                        <h5 className="aboutheader">Smart Contract Risk</h5>
                        <p>Smart contracts are immutable pieces of code which execute transactions, modifying the state of the underlying ledger. There is no risk in the predictability of a smart contracts output, but there is a risk that a smart contract could be used in unintended ways, and result in malicious access to contract funds. This risk is primarily addressed through reputation and audits. It is unwise to interact with a smart contract which has not been formally audited and widely used. AAVE fits both of these criteria, with AAVE V2 having been audited <a href="https://docs.aave.com/developers/security-and-audits">five times</a>, and the total value locked in AAVE currently exceeding $5 Billion. A DeFi application is only as strong as it's weakest smart contract dependency, which makes it extremely important to understand the smart contract risks involved before interacting with any DeFi application. An additional route to explore is purchasing insurance on your deposits. This is currently available through products such as <a href="https://app.nexusmutual.io/membership">Nexus Mutual</a> or <a href="https://app.coverprotocol.com/app/marketplace">Cover Protocol</a>.</p>
                        <h5 className="aboutheader">Interest Rate Fluctuation</h5>
                        <p>Interest rates in AAVE are determined by deposit and borrow demand, which can shift dramatically over time. If an interest rate arbitrage moves out of your favor, you may consider using the collateral or debt swaps features on AAVE to switch your position. The downside to this approach is obvisouly gas cost. In the future we hope to build tools to estimate the gas costs of entering and maintaining an AAVEtrage position to help users make informed decisions about the risk/reward of AAVEtrage. One way to minimize this risk is by utilizing stable borrow rates. We are also looking into integrating tools for stable deposit rates such as <a href="https://app.barnbridge.com/yield-farming">BarnBridge</a> or <a href="https://88mph.app">88mph</a>.</p>
                        <h5 className="aboutheader">Liquidation Risk</h5>
                        <p>AAVE is a decentralized protocol which operates under the condition the borrow positions require sufficient collateralization. If the collateralization ratio of your borrow position falls below a certain threshold, your position can be liquidated. Liquidiation is a process where another user pays back your debt, and gets to keep your collateral plus a liquidation penalty. It is very important to monitor the health factor of borrowing positions to avoid liquidation. Some tools that can help you avoid liquidation are automated positions from <a href="https://app.defisaver.com/aave/manage">DeFiSaver</a>, or health factor notifications from <a href="https://9000.hal.xyz/recipes/aave-track-your-health-factor">HAL</a>.</p>
                    </div>
                    <div style={{ position: 'relative', textAlign: "center", width: '100%', margin: '0 auto', padding: '30px' }}>

                        <p className="aboutheader">Built for ETHGlobal MarketMake Hackathon 2021</p>
                    </div>

                </div>

            </header></div>
    );
}

export default About;




