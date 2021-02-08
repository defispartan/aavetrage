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
import KawaiImage from '../assets/img/flashloankawai.png'
import {
    Button, Card, Modal,
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
    const [kawaiOpen, setKawaiOpen] = useState(false)

    async function fetchRates() {
        let ret = await getRates()
        if (ret[0] === true) {
            setErrorActive(true)
            setErrorMessage(ret[1])
        }
        else {

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

    const toggleKawai = () => setKawaiOpen(!kawaiOpen)
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
        let bestStableBorrow = []
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
            if (ops[0][4] < ops[1][4]) {
                bestStableBorrow = ['V1', ops[0][5], ops[0][4]]
            }
            else {
                bestStableBorrow = ['V2', ops[1][5], ops[1][4]]
            }



            return (<><div className="col-two"> <div className="head">Best Overall AAVEtrage (All Markets)</div>

                <div className="aavetrage">
                    <div className="col-four">
                        <img src={Ghost} className="ghost"></img>
                        <i className="fa fa-arrow-right" style={{ marginLeft: "30px", fontSize: "3em" }}></i>
                        <h5 style={{ fontFamily: "Orbitron", color: "white", paddingTop: "10px" }}>Borrow</h5>
                    </div>
                    <div className="col-four">
                        <Card style={{ marginRight: "20px", marginLeft: "20px" }}>
                            <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>AAVE {bestBorrow[0]}</h5>
                            <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>{bestBorrow[1]}</h5>
                            <h4 style={{ color: "#2EBAC6", padding: "2px", margin: "0" }}>{bestBorrow[2]}%</h4>
                            <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>Variable</h5>
                        </Card>

                        <Card style={{ marginRight: "20px", marginLeft: "20px", marginTop: "30px" }}>
                            <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>AAVE {bestStableBorrow[0]}</h5>
                            <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>{bestStableBorrow[1]}</h5>
                            <h4 style={{ color: "#B6509E", padding: "2px", margin: "0" }}>{bestStableBorrow[2]}%</h4>
                            <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>Stable</h5>
                        </Card>
                    </div>
                    <div className="col-four">
                        <Card style={{ marginRight: "20px", marginLeft: "20px" }}>
                            <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>AAVE {bestDeposit[0]}</h5>
                            <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>{bestDeposit[1]}</h5>
                            <h4 style={{ color: "#2EBAC6", padding: "2px", margin: "0" }}>{bestDeposit[2]}%</h4>
                            <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>Variable</h5>
                        </Card>


                    </div>
                    <div className="col-four">
                        <i className="fa fa-arrow-right" style={{ marginRight: "30px", fontSize: "3em" }}></i>
                        <img src={Ghost} className="ghost"></img>
                        <h5 style={{ fontFamily: "Orbitron", color: "white", paddingTop: "10px" }}>Deposit</h5>
                    </div>

                    <div className="profit"><strong>{round(bestDeposit[2] - bestBorrow[2], 2)}</strong> % (Variable Borrow) or <strong>{round(bestDeposit[2] - bestStableBorrow[2], 2)}</strong> % (Stable Borrow) Spread</div>


                </div>
            </div>
                <div className="col-two">
                    <div className="head">Best V2 AAVEtrage</div>
                    <div className="aavetrage">
                        <div className="col-four">
                            <img src={Ghost} className="ghost"></img>
                            <i className="fa fa-arrow-right" style={{ marginLeft: "30px", fontSize: "3em" }}></i>
                            <h5 style={{ fontFamily: "Orbitron", color: "white", paddingTop: "10px" }}>Borrow</h5>
                        </div>
                        <div className="col-four">
                            <div className="borrowWrap">
                                <Card style={{ marginRight: "20px", marginLeft: "20px" }}>
                                    <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>AAVE V2</h5>
                                    <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>{ops[1][3]}</h5>
                                    <h4 style={{ color: "#2EBAC6", padding: "2px", margin: "0" }}>{ops[1][2]}%</h4>
                                    <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>Variable</h5>
                                </Card>

                                <Card style={{ marginRight: "20px", marginLeft: "20px", marginTop: "30px" }}>
                                    <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>AAVE V2</h5>
                                    <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>{ops[1][5]}</h5>
                                    <h4 style={{ color: "#B6509E", padding: "2px", margin: "0" }}>{ops[1][4]}%</h4>
                                    <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>Stable</h5>
                                </Card>
                            </div>
                        </div>
                        <div className="col-four">
                            <Card style={{ marginRight: "20px", marginLeft: "20px" }}>
                                <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>AAVE V2</h5>
                                <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>{ops[1][1]}</h5>
                                <h4 style={{ color: "#2EBAC6", padding: "2px", margin: "0" }}>{ops[1][0]}%</h4>
                                <h5 style={{ fontFamily: "Orbitron", color: "black", padding: "2px", margin: "0" }}>Variable</h5>
                            </Card>

                        </div>
                        <div className="col-four">
                            <i className="fa fa-arrow-right" style={{ marginRight: "30px", fontSize: "3em" }}></i>
                            <img src={Ghost} className="ghost"></img>
                            <h5 style={{ fontFamily: "Orbitron", color: "white", paddingTop: "10px" }}>Deposit</h5>
                        </div>
                        <div className="profit"><strong>{round(ops[1][0] - ops[1][2], 2)}</strong> % (Variable Borrow) or <strong>{round(ops[1][0] - ops[1][4], 2)}</strong> % (Stable Borrow) Spread <div style={{ display: "inline" }} onClick={() => toggleKawai()}><a><img src={Boost} className="boost"></img></a></div></div>


                    </div>
                </div>






                <div className="tableheader">Stablecoin Rates</div></>)

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
                <Modal size="lg" isOpen={kawaiOpen} centered={true}>
                    <ModalBody>
                        <img src={KawaiImage} alt="flashloan boost kawai" className="kawai"></img>
                    </ModalBody>
                    <ModalFooter>
                        <a href="/about">
                            <Button color="secondary" onClick={() => toggleKawai()}>
                                Learn More
              </Button>
                        </a>
                        <Button color="secondary" onClick={() => toggleKawai()}>
                            Close
          </Button>
                    </ModalFooter>

                </Modal>
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

                <div className="description">
                    Borrow, Deposit, Earn
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