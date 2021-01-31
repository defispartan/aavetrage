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
import { getRates } from './Data/Rates.js'
import {
    Button, Modal,
    ModalHeader,
    ModalBody,
    ModalFooter, Spinner
} from 'reactstrap'
import dayjs from "dayjs";


const round = (value, decimals) => {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}


const Home = () => {


    const [homeHover, setHomeHover] = useState(false)
    const [portfolioHover, setPortfolioHover] = useState(false)
    const [aboutHover, setAboutHover] = useState(false)
    const [ratesLoaded, setRatesLoaded] = useState(localStorage.getItem("ratesLoaded") || false)
    const [rates, setRates] = useState(JSON.parse(localStorage.getItem("rates")) || null)
    const [ops, setOps] = useState(JSON.parse(localStorage.getItem("ops")) || null)
    const [lastRefresh, setLastRefresh] = useState(localStorage.getItem("lastRefresh") || null)
    const [errorActive, setErrorActive] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    async function fetchRates() {
        let ret = await getRates()
        if (ret[0] === true) {
            setErrorActive(true)
            setErrorMessage(ret[1])
        }
        else {
            console.log("RETTTT")
            console.log(ret)
            setOps([ret[1], ret[2]])
            setRates(ret[0])
            localStorage.setItem("rates", JSON.stringify(ret[0]))
            localStorage.setItem("ratesLoaded", true)
            localStorage.setItem("lastRefresh", dayjs().format())
            localStorage.setItem("ops", JSON.stringify([ret[1], ret[2]]))
            setLastRefresh(dayjs().format())
            setRatesLoaded(true)
        }
    }


    useEffect(() => {
        if (ratesLoaded === false) {
            localStorage.setItem("ratesLoaded", false)
            fetchRates()
        }
    }, [ratesLoaded])


    const triggerErrorClose = () => {
        setErrorActive(false)
        setErrorMessage("")
    }

    const triggerRefresh = () => {
        setRatesLoaded(false)

    }

    const displayRefresh = () => {
        if (ratesLoaded === false) {
            return <></>
        }
        else {

            return (
                <div style={{ paddingBottom: "10px", color: "white", width: "75%", display: "inline-block" }}>
                    <Button style={{ display: "inline-block", float: "left" }} onClick={() => triggerRefresh()}>Refresh Data</Button>



                    <p style={{ marginLeft: '10px', marginTop: "5px", float: "left" }}>
                        {" "}
            Last Refresh:{" "}
                        {round(dayjs().diff(dayjs(lastRefresh)) / 60000, 0)}{" "}
            minutes ago
          </p>               <div className="rateentry">Stable<div className="box pink"></div></div>
                    <div className="rateentry">Variable<div className="box blue"></div></div>
                </div>
            );
        }
    };

    const displayTable = () => {
        if (ratesLoaded) {
            return <RateTable rates={rates} />
        }
    }

    const displayOps = () => {
        let bestDeposit = []
        let bestBorrow = []
        if (ratesLoaded) {
            if (ops[0][0] > ops[1][0]) {
                bestDeposit = ['V1', ops[0][1], ops[0][0]]
            }
            else {
                bestDeposit = ['V2', ops[1][1], ops[1][0]]
            }
            if (ops[0][2] < ops[1][2]) {
                bestBorrow = ['V1', ops[0][3], ops[0][2]]
            }
            else {
                bestBorrow = ['V2', ops[1][3], ops[1][2]]
            }



            return (<div> <div className="col-two head">Best Overall AAVEtrage (All Markets)</div>
                <div className="col-two head">Best V2 AAVEtrage</div>
                <div className="aavetrage">
                    <div className="col-four">
                        <img src={Ghost} className="ghost"></img>
                        <i className="fa fa-arrow-right"></i>
                        <p>Borrow</p>
                    </div>
                    <div className="col-four">

                        <p className="rbtext">  AAVE {bestBorrow[0]} {bestBorrow[1]} @ {bestBorrow[2]} %</p>
                    </div>
                    <div className="col-four">
                        <p className="rbtext"> AAVE {bestDeposit[0]} {bestDeposit[1]} @ {bestDeposit[2]} %</p>

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
                            <p className="rbtext"> AAVE V2 {ops[1][3]} @ {ops[1][2]} %</p>
                        </div>
                    </div>
                    <div className="col-four">

                        <p className="rbtext">AAVE V2 {ops[1][1]} @ {ops[1][0]} %</p>

                    </div>
                    <div className="col-four">
                        <i className="fa fa-arrow-right"></i>
                        <img src={Ghost} className="ghost"></img>
                        <p>Deposit</p>
                    </div>


                </div>
                <div className="col-two profit">{bestDeposit[2] - bestBorrow[2]} % Difference</div>
                <div className="col-two profit">{ops[1][0] - ops[1][2]} % Difference <a href="/about"><img src={Boost} className="boost"></img></a></div>
                <div className="tableheader">Stablecoin Rates</div>
            </div>)
        }
        else {
            return (

                <div style={{ width: '100%', margin: "0 auto", textAlign: "center" }}>

                    <Spinner style={{ width: "3em", height: "3em" }} color="primary" />
                    <p style={{ color: 'white', paddingTop: '20px' }}>Loading stablecoin rates</p>
                </div>

            )
        }
    }

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
                <Modal isOpen={errorActive} centered={true}>
                    <ModalHeader>{"Error"}</ModalHeader>
                    <ModalBody>
                        {errorMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => triggerErrorClose()}>
                            Close
          </Button>
                    </ModalFooter>
                </Modal>
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

                    <img src={logo} className="aavetrageimage" alt="aavetrage" />
                </div>


                <div className="asset">
                    {displayOps()}
                    {displayRefresh()}
                    <div className="ratematrix">
                        {displayTable()}

                    </div>
                </div>
            </header>

        </div>
    );

}

export default Home;