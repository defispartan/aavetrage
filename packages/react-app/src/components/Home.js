import React, { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import logo from '../assets/img/aavetrage.png';
import Ghost from '../assets/img/ghost.png';
import Asset from './Asset.js'
import RateBlock from './RateBlock.js'
import Boost from '../assets/img/boost.png'
import RateTable from './RateTable.js'

const Home = () => {

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

                    <img src={logo} className="aavetragelogo" alt="aavetrage" />
                </div>


                <div className="asset">
                    <div className="col-two head">Cross Market AAVEtrage</div>
                    <div className="col-two head">V2 AAVEtrage</div>
                    <div className="aavetrage">
                        <div className="col-four">
                            <img src={Ghost} className="ghost"></img>
                            <i className="fa fa-arrow-right"></i>
                            <p>Borrow</p>
                        </div>
                        <div className="col-four">

                            <p className="rbtext">  AAVE V1 TUSD @ 3.79 %</p>
                        </div>
                        <div className="col-four">
                            <p className="rbtext"> AAVE V2 TUSD @ 20.87 %</p>

                        </div>
                        <div className="col-four">
                            <i className="fa fa-arrow-right"></i>
                            <img src={Ghost} className="ghost"></img>
                            <p>Deposit</p>
                        </div>


                    </div>
                    <div className="aavetrage">
                        <div className="col-four">
                            <img src={Ghost} className="ghost"></img>
                            <i className="fa fa-arrow-right"></i>
                            <p>Borrow</p>
                        </div>
                        <div className="col-four">
                            <div className="borrowWrap">
                                <p className="rbtext"> AAVE V2 USDC @ 3.86 %</p>
                            </div>
                        </div>
                        <div className="col-four">

                            <p className="rbtext">AAVE V2 TUSD @ 20.87 %</p>

                        </div>
                        <div className="col-four">
                            <i className="fa fa-arrow-right"></i>
                            <img src={Ghost} className="ghost"></img>
                            <p>Deposit</p>
                        </div>


                    </div>
                    <div className="col-two profit">17.08% Difference</div>
                    <div className="col-two profit">17.01% Difference <a href="/about"><img src={Boost} className="boost"></img></a></div>
                    <div className="tableheader">Stablecoin Rates</div>
                    <div className="raterow">
                        <div className="rateentry">Stable<div className="box pink"></div></div>
                        <div className="rateentry">Variable<div className="box blue"></div></div>
                    </div>
                    <div className="ratematrix">

                        <RateTable />
                    </div>
                </div>
            </header>

        </div>
    );

}

export default Home;