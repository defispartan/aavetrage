import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "../App.css";




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

                    <h1 className="aboutpageheader">About</h1>
                </div>


                <div className="asset">
                    <div className="aboutsection">
                        <h3 className="aboutheader">What is AAVE?</h3>
                        <p>AAVE is decentralized and non-custodial money market protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion. For borrowers, they are given the option to borrow at either variable or fixed rates. Depositors receive an aToken version of the asset they have deposited into AAVE, which accrues interest each second. Each asset exists as its own pool. The protocol has been audited and secured. The protocol is open source, which allows anyone to interact with the user interface client, API or directly with the smart contracts on the Ethereum network. Being open source means that users are able to build any third-party service or application to interact with the protocol and enrich their product (like this one). The decentralized nature of AAVE also means that users can propose changes to the protocol in the form of governance. </p>
                    </div>
                    <div className="aboutsection">
                        <h3 className="aboutheader">What is AAVEtrage?</h3>
                    </div>
                    <div className="aboutsection">
                        <h3 className="aboutheader">What is a flashloan?</h3>
                    </div>
                    <div className="aboutsection">
                        <h3 className="aboutheader">What is the flashloan boost?</h3>
                    </div>
                    <div style={{ position: 'absolute', bottom: '40px', textAlign: "center", width: '100%', margin: '0 auto' }}>

                        <p className="aboutheader">Built for ETHGlobal MarketMake Hackathon 2021</p>
                    </div>

                </div>

            </header></div>
    );
}

export default About;




