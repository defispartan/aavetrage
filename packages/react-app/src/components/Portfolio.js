import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "../App.css";
import PortfolioImg from '../assets/img/portfolio.png'
import AAVEText from '../assets/img/aavetext.png'
import { Button, Card, CardHeader, Container, Progress, Table } from 'reactstrap';



function Portfolio(props) {

    const [homeHover, setHomeHover] = useState(false)
    const [portfolioHover, setPortfolioHover] = useState(false)
    const [aboutHover, setAboutHover] = useState(false)
    const [v1Action, setV1Action] = useState(null)
    const [v2Action, setV2Action] = useState(null)


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
                <Card className="shadow marketcard">
                    <CardHeader className="border-0">
                        <h3>{v1Action}</h3>
                    </CardHeader>
                </Card>
            )
        }
        else {

            return <></>
        }
    }

    const displayV2ActionPanel = () => {
        if (v2Action !== null) {
            return (
                <Card className="shadow marketcard">
                    <CardHeader className="border-0">
                        <h3>{v2Action}</h3>
                    </CardHeader>
                </Card>
            )
        }
        else {

            return <></>
        }
    }

    const setAction = (market, action) => {
        if (market === 'v1') {
            setV1Action(action)
        }
        else if (market === 'v2') {
            setV2Action(action)
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


                <div className="asset">

                    <h3 className="portfolioheader">AAVE Portfolio Balance</h3>
                    <h3 className="portfolioheader" style={{ fontFamily: 'Open Sans', paddingBottom: "50px" }}>$21,000,000.00</h3>

                    <div className="marketoverview">

                        <div className="marketheaderblock" style={{ paddingBottom: "75px" }}>
                            <h4 style={{ color: 'white' }}>AAVE V1 Market</h4>
                            <div className="marketheaderblock">
                                <p>Deposits</p>
                                <p style={{ fontFamily: 'Open Sans' }}>$10,000,000.00</p>
                            </div>
                            <div className="marketheaderblock">
                                <p>Borrows</p>
                                <p style={{ fontFamily: 'Open Sans' }}>$5,000,000.00</p>
                            </div>
                            <div className="borrowpower">
                                <h5 style={{ color: 'white' }}>Borrowing Power - 75%</h5>
                                <Progress value="75" />
                            </div>

                        </div>
                        <div className="marketheaderblock" style={{ paddingBottom: "75px" }}>
                            <h4 style={{ color: 'white' }}>AAVE V2 Market</h4>
                            <div className="marketheaderblock">
                                <p>Deposits</p>
                                <p style={{ fontFamily: 'Open Sans' }}>$21,000,000.00</p>
                            </div>
                            <div className="marketheaderblock">
                                <p>Borrows</p>
                                <p style={{ fontFamily: 'Open Sans' }}>$5,000,000.00</p>
                            </div>
                            <div className="borrowpower">
                                <h5 style={{ color: 'white' }}>Borrowing Power - 40%</h5>
                                <Progress value="40" />
                            </div>

                        </div>
                    </div>

                    <div className="ratematrix">

                        <Card className="shadow marketcard">
                            <CardHeader className="border-0">
                                <h3>AAVE V1 Market</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th colspan="3">Deposits</th>
                                        <th colspan="3">Borrows</th>
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
                                <tbody>

                                    <tr>
                                        <td>1,000,000 USDC</td>
                                        <td>14.21% Variable</td>
                                        <td>$1,000,000</td>
                                        <td>500,000 DAI</td>
                                        <td>7.21% Stable</td>
                                        <td>$500,000</td>
                                    </tr>
                                    <tr>
                                        <td>2000 AAVE</td>
                                        <td>0.21% Variable</td>
                                        <td>$560,000</td>
                                        <td>250,000 TUSD</td>
                                        <td>13.1% Variable</td>
                                        <td>$250,000</td>
                                    </tr>
                                    <tr>
                                        <td>2000 SNX</td>
                                        <td>2.5% Variable</td>
                                        <td>$33,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
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
                    </div>


                    <div className="ratematrix">

                        <Card className="shadow marketcard">
                            <CardHeader className="border-0">
                                <h3>AAVE V2 Market</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th colspan="3">Deposits</th>
                                        <th colspan="3">Borrows</th>
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
                                <tbody>

                                    <tr>
                                        <td>1,000,000 USDC</td>
                                        <td>14.21% Variable</td>
                                        <td>$1,000,000</td>
                                        <td>500,000 DAI</td>
                                        <td>7.21% Stable</td>
                                        <td>$500,000</td>
                                    </tr>
                                    <tr>
                                        <td>2000 AAVE</td>
                                        <td>0.21% Variable</td>
                                        <td>$560,000</td>
                                        <td>250,000 TUSD</td>
                                        <td>13.1% Variable</td>
                                        <td>$250,000</td>
                                    </tr>
                                    <tr>
                                        <td>2000 SNX</td>
                                        <td>2.5% Variable</td>
                                        <td>$33,000</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
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



                </div>



            </header></div >
    );
}

export default Portfolio;




